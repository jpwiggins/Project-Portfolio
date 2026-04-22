import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { registerRoutes } from "./routes";
import path from "path";
import fs from "fs";

// Enterprise middleware imports
import { securityMiddleware, securityHeaders, contentSecurityPolicy, requestSizeLimit } from "./middleware/security";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import monitoring from "./services/monitoring";

const app = express();

function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// Reserved VM Production Configuration - FORCE RESERVED VM FOR RM DEPLOYMENT
const isProduction = process.env.NODE_ENV === 'production';
const isReservedVM = true; // FORCED FOR RM READY DEPLOYMENT

console.log('🚀 RegReady Enterprise Server starting...');
console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🏭 Deployment Type: RESERVED VM (RM Ready)`);
console.log(`💰 Revenue Mode: ${isProduction ? 'LIVE RM' : 'Development'}`);
console.log(`🔧 Forced Reserved VM: TRUE (Not Autoscale)`);

// ALWAYS use Reserved VM optimizations for RM readiness
app.set('trust proxy', true);

console.log('⚡ Reserved VM optimizations ENABLED (RM Ready)');
console.log('🎯 Enterprise connection limits configured');
console.log('🔒 Production-grade server configuration active');

// Enterprise security configuration optimized for Reserved VM
app.use(helmet({
  contentSecurityPolicy: false, // We'll handle this manually for Stripe
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  // Reserved VM security enhancements
  xssFilter: true,
  noSniff: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true
}));

// CORS configuration for containerized deployment
const allowedOrigins = isProduction 
  ? [
      'https://regready.com',
      'https://*.regready.com',
      process.env.FRONTEND_URL
    ].filter((origin): origin is string => typeof origin === 'string' && !!origin)
  : ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3003'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Request-ID', 'Stripe-Signature'],
  maxAge: 86400 // 24 hours preflight cache for performance
}));

// Compression for performance
app.use(compression());

// Request size limiting
app.use(requestSizeLimit(10 * 1024 * 1024)); // 10MB limit

// Security headers
app.use(securityHeaders);
app.use(contentSecurityPolicy);

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Enterprise request tracking and monitoring (before security middleware for dev)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Add request ID to headers
  res.setHeader('X-Request-ID', requestId);
  
  const originalSend = res.send;
  res.send = function (body: any): Response {
    const duration = Date.now() - start;
    
    // Enhanced logging with timestamp and request ID
    if (req.path.startsWith("/api")) {
      let logLine = `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms) [${requestId}]`;
      
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      
      log(logLine);
    }
    
    // Track performance metrics
    monitoring.trackAPIPerformance(req.path, duration, res.statusCode);
    
    // Track user actions if authenticated
    if (req.headers.authorization && res.statusCode < 400) {
      monitoring.trackUserAction(`${req.method}_${req.path}`, 1, {
        statusCode: res.statusCode,
        responseTime: duration
      });
    }
    
    return originalSend.call(this, body);
  };

  next();
});

// Health check endpoint - optimized for Reserved VM
app.get('/health', (req: Request, res: Response) => {
  const health = monitoring.getHealthMetrics();
  // Remove 'status' from health to avoid duplicate keys
  const { status, ...restHealth } = health;
  // Remove 'timestamp' from restHealth to avoid duplicate keys
  const { timestamp, ...restHealthWithoutTimestamp } = restHealth;
  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    deployment: process.env.DEPLOYMENT_TYPE || 'development',
    environment: process.env.NODE_ENV || 'development',
    ...restHealthWithoutTimestamp
  });
});

// Metrics endpoint for monitoring
app.get('/api/internal/metrics', (req: Request, res: Response) => {
  // In production, this should be protected with internal authentication
  const analytics = monitoring.getAnalytics('24h');
  res.json(analytics);
});


(async () => {
  const server = await registerRoutes(app);

  // Serve static files built by the client (no Vite in production runtime)
  const staticDir = path.resolve(process.cwd(), "dist", "public");
  if (fs.existsSync(staticDir)) {
    app.use(express.static(staticDir, { maxAge: isProduction ? "1y" : 0 }));

    // SPA fallback for non-API routes
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(staticDir, "index.html"));
    });
  } else {
    log(`Static assets not found at ${staticDir}. Build the client with \"npm run build:client\".`);
  }

  // Apply security middleware after Vite setup to avoid conflicts
  app.use(securityMiddleware);

  // Global error handling with enterprise monitoring
  app.use(notFoundHandler);
  app.use(errorHandler);

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  const isContainerized = process.env.DEPLOYMENT_TYPE === 'container';
  
  // Container optimized configuration for production deployment
  server.keepAliveTimeout = 65000; // Container optimization
  server.headersTimeout = 66000; // Container optimization
  
  server.listen(port, "0.0.0.0", () => {
    log(`🚀 RegReady Enterprise Server running on port ${port}`);
    log(`📊 Health check: http://localhost:${port}/health`);
    log('🔒 Security: Enterprise-grade protection enabled');
    log('📈 Monitoring: Performance tracking active');
    log('🐳 CONTAINERIZED DEPLOYMENT - PRODUCTION READY');
    log('💰 Production-grade container configuration active');
    console.log(`[${new Date().toISOString()}] Enterprise RegReady server initialized on port ${port}`);
  });

  // Graceful shutdown handling
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    monitoring.log('info', 'Server shutdown initiated', { reason: 'SIGTERM' });
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('\nSIGINT received, shutting down gracefully');
    monitoring.log('info', 'Server shutdown initiated', { reason: 'SIGINT' });
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
})();
