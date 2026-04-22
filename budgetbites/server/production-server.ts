import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { assetCache, getCacheStats } from "./cache-service";
import compression from "compression";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Production static file serving with compression and caching
export function serveStatic(app: Express) {
  // Enable compression for all responses
  app.use(compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6, // Balanced compression level
    threshold: 1024, // Only compress responses > 1KB
  }));

  const distPath = path.resolve(import.meta.dirname, "../dist/public");
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Cache control headers for different file types
  const cacheHeaders = {
    // Static assets (JS, CSS, images) - long cache
    static: {
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
      'Expires': new Date(Date.now() + 31536000000).toUTCString()
    },
    // HTML files - short cache to enable updates
    html: {
      'Cache-Control': 'public, max-age=300, must-revalidate', // 5 minutes
      'Expires': new Date(Date.now() + 300000).toUTCString()
    },
    // API responses - no cache
    api: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  };

  // Serve static files with proper caching
  app.use(express.static(distPath, {
    maxAge: '1y', // Browser cache
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath);
      
      // Set appropriate cache headers based on file type
      if (['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2'].includes(ext)) {
        Object.entries(cacheHeaders.static).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
      } else if (ext === '.html') {
        Object.entries(cacheHeaders.html).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
      }
      
      // Security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
    }
  }));

  // Health check endpoint for load balancers
  app.get('/api/health', (_req, res) => {
    const cacheStats = getCacheStats();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cache: cacheStats,
      version: process.env.npm_package_version || '1.0.0'
    });
  });

  // Serve index.html for all non-API routes (SPA support)
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }

    const indexPath = path.resolve(distPath, "index.html");
    
    // Check if index.html exists
    if (!fs.existsSync(indexPath)) {
      return res.status(500).json({ 
        message: 'Application not properly built. Run npm run build first.' 
      });
    }

    // Set HTML cache headers
    Object.entries(cacheHeaders.html).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Security headers for HTML
    res.setHeader('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https:; " +
      "frame-ancestors 'none';"
    );

    res.sendFile(indexPath);
  });
}

// Production server setup without Vite
export async function setupProductionServer(app: Express, server: Server) {
  log("Setting up production server configuration...");

  // Trust proxy (important for DigitalOcean load balancers)
  app.set('trust proxy', 1);

  // Security middleware
  app.disable('x-powered-by');

  // Request timeout (prevent hanging requests)
  server.timeout = 30000; // 30 seconds

  // Keep-alive settings for better performance
  server.keepAliveTimeout = 61000; // 61 seconds
  server.headersTimeout = 62000; // 62 seconds

  // Graceful shutdown handling
  const gracefulShutdown = (signal: string) => {
    log(`Received ${signal}, shutting down gracefully...`);
    
    server.close((err) => {
      if (err) {
        log(`Error during shutdown: ${err.message}`, 'error');
        process.exit(1);
      }
      
      log('Server closed successfully');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      log('Forcing shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  // Handle graceful shutdown
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions and unhandled rejections
  process.on('uncaughtException', (err) => {
    log(`Uncaught Exception: ${err.message}`, 'error');
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
    gracefulShutdown('unhandledRejection');
  });

  log("Production server configuration complete");
}
