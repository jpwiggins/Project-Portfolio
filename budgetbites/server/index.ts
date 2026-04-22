import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import { serveStatic, setupProductionServer } from "./production-server";
import { monitorCacheMemory } from "./cache-service";
import { 
  requestTimeout, 
  preventMemoryLeaks, 
  rateLimit, 
  healthMonitoring, 
  corsMiddleware 
} from "./middleware";

const app = express();

// Security and performance middleware
app.use(corsMiddleware());
app.use(requestTimeout(30000)); // 30 second timeout
app.use(preventMemoryLeaks());
app.use(healthMonitoring());

// Rate limiting (more permissive in development)
const isProduction = process.env.NODE_ENV === 'production';
app.use(rateLimit(
  15 * 60 * 1000, // 15 minutes window
  isProduction ? 100 : 1000 // 100 requests per window in production, 1000 in dev
));

app.use(express.json({ limit: '10mb' })); // Reasonable JSON limit
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    console.log("Setting up Vite development server...");
    await setupVite(app, server);
    console.log("Vite development server ready");
  } else {
    console.log("Setting up production server...");
    await setupProductionServer(app, server);
    serveStatic(app);
    console.log("Production server ready");
    
    // Start cache monitoring in production
    monitorCacheMemory();
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Default to 3004 for production deployment
  // this serves both the API and the client.
  const port = parseInt(process.env.PORT || '3004', 10);
  const host = process.env.HOST || '0.0.0.0';
  
  server.listen(port, host, () => {
    log(`serving on port ${port}`);
    console.log(`🚀 BudgetBites server ready at:`);
    console.log(`   http://localhost:${port}`);
    console.log(`   http://${host}:${port}`);
    console.log(`   Environment: ${app.get('env')}`);
  });
})();
