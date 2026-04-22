import { Request, Response, NextFunction } from 'express';
import { cacheApiResponse, getCachedApiResponse } from './cache-service';

// Request timeout middleware to prevent hanging requests
export function requestTimeout(timeout: number = 30000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({ 
          error: 'Request timeout',
          message: 'The request took too long to process'
        });
      }
    }, timeout);

    // Clear timeout when response finishes
    res.on('finish', () => {
      clearTimeout(timer);
    });

    // Clear timeout when connection closes
    req.on('close', () => {
      clearTimeout(timer);
    });

    next();
  };
}

// Memory leak prevention middleware
export function preventMemoryLeaks() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Prevent request body from being too large
    if (req.headers['content-length']) {
      const contentLength = parseInt(req.headers['content-length']);
      if (contentLength > 50 * 1024 * 1024) { // 50MB limit
        return res.status(413).json({
          error: 'Payload too large',
          message: 'Request body exceeds maximum size limit'
        });
      }
    }

    // Clean up request-specific data after response
    res.on('finish', () => {
      // Clear any request-specific cached data
      if (req.body) {
        req.body = null;
      }
      
      // Force garbage collection in development
      if (process.env.NODE_ENV === 'development' && global.gc) {
        global.gc();
      }
    });

    next();
  };
}

// API response caching middleware
export function cacheMiddleware(ttl: number = 300000) { // 5 minutes default
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Don't cache requests with query parameters that indicate real-time data
    if (req.query.t || req.query.timestamp || req.query.nocache) {
      return next();
    }

    const cacheKey = `api:${req.originalUrl}`;
    const cachedResponse = getCachedApiResponse(cacheKey);

    if (cachedResponse) {
      res.set('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }

    // Intercept the response
    const originalJson = res.json;
    res.json = function(data) {
      // Cache successful responses only
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheApiResponse(cacheKey, data, ttl);
        res.set('X-Cache', 'MISS');
      }
      
      return originalJson.call(this, data);
    };

    next();
  };
}

// Rate limiting middleware (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    // Clean up expired entries every hour
    if (Math.random() < 0.001) { // 0.1% chance per request
      rateLimitMap.forEach((data, ip) => {
        if (now > data.resetTime) {
          rateLimitMap.delete(ip);
        }
      });
    }

    const clientData = rateLimitMap.get(clientIP);
    
    if (!clientData || now > clientData.resetTime) {
      // Reset or create new entry
      rateLimitMap.set(clientIP, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }

    clientData.count++;
    next();
  };
}

// Health monitoring middleware
export function healthMonitoring() {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const memUsage = process.memoryUsage();
      
      // Log slow requests
      if (duration > 5000) { // 5 seconds
        console.warn(`Slow request: ${req.method} ${req.originalUrl} took ${duration}ms`);
      }
      
      // Log high memory usage
      if (memUsage.heapUsed > 200 * 1024 * 1024) { // 200MB
        console.warn(`High memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
      }
    });

    next();
  };
}

// CORS middleware with security considerations
export function corsMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3004'];
    
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (!origin) {
      // Allow same-origin requests
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '3600');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  };
}
