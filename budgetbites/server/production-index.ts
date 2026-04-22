import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { log } from "./production-server";
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

// Force production environment
process.env.NODE_ENV = 'production';
app.set('env', 'production');

// Security and performance middleware
app.use(corsMiddleware());
app.use(requestTimeout(30000)); // 30 second timeout
app.use(preventMemoryLeaks());
app.use(healthMonitoring());

// Production rate limiting
app.use(rateLimit(
  15 * 60 * 1000, // 15 minutes window
  100 // 100 requests per window in production
));

app.use(express.json({ limit: '10mb' })); // Reasonable JSON limit
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Request logging middleware
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
  try {
    log("Starting BudgetBites production server...");
    
    const server = await registerRoutes(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(`Error ${status}: ${message}`, 'error');
      res.status(status).json({ message });
    });

    // Setup production server configuration
    log("Setting up production server...");
    await setupProductionServer(app, server);
    serveStatic(app);
    log("Production server configuration complete");
    
    // Start cache monitoring in production
    monitorCacheMemory();

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Default to 3004 for production deployment
    const port = parseInt(process.env.PORT || '3004', 10);
    const host = process.env.HOST || '0.0.0.0';
    
    server.listen(port, host, () => {
      log(`BudgetBites production server listening on ${host}:${port}`);
      console.log(`🚀 BudgetBites production server ready at:`);
      console.log(`   http://localhost:${port}`);
      console.log(`   http://${host}:${port}`);
      console.log(`   Environment: ${app.get('env')}`);
      console.log(`   Process ID: ${process.pid}`);
      console.log(`   Node.js version: ${process.version}`);
    });
  } catch (error) {
    log(`Failed to start server: ${error}`, 'error');
    process.exit(1);
  }
})();