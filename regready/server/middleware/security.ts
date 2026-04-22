import { Request, Response, NextFunction } from 'express';
import { security } from '../services/security';
import { createError } from './errorHandler';

export interface SecureRequest extends Request {
  securityScore?: number;
  isValidated?: boolean;
}

// Security validation middleware
export const securityMiddleware = (req: SecureRequest, res: Response, next: NextFunction) => {
  // Check if IP is blocked
  if (security.isIPBlocked(req.ip)) {
    return res.status(403).json({
      error: 'Access denied',
      code: 'IP_BLOCKED',
      message: 'Your IP address has been temporarily blocked due to suspicious activity'
    });
  }

  // Validate request integrity
  if (!security.validateRequestIntegrity(req)) {
    return res.status(400).json({
      error: 'Invalid request',
      code: 'SECURITY_VIOLATION',
      message: 'Request failed security validation'
    });
  }

  // Sanitize input data
  if (req.body) {
    req.body = security.sanitizeInput(req.body);
  }
  
  if (req.query) {
    req.query = security.sanitizeInput(req.query);
  }

  req.isValidated = true;
  next();
};

// CSRF protection
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    
    // For demo purposes, we'll skip actual CSRF validation
    // In production, implement proper CSRF token validation
    if (!token && process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        error: 'CSRF token required',
        code: 'CSRF_MISSING'
      });
    }
  }
  
  next();
};

// Content Security Policy
export const contentSecurityPolicy = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.stripe.com",
    "frame-src https://js.stripe.com"
  ].join('; '));
  
  next();
};

// Security headers
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict transport security (HTTPS only)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  res.setHeader('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=(self)'
  ].join(', '));
  
  next();
};

// Request size limiting
export const requestSizeLimit = (maxSize: number = 10 * 1024 * 1024) => { // 10MB default
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    
    if (contentLength > maxSize) {
      return res.status(413).json({
        error: 'Request too large',
        code: 'REQUEST_TOO_LARGE',
        maxSize: `${maxSize / (1024 * 1024)}MB`
      });
    }
    
    next();
  };
};

// Sensitive data detection
export const sensitiveDataProtection = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(data: any) {
    // Check for sensitive data patterns in response
    if (typeof data === 'string') {
      // Remove potential credit card numbers
      data = data.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[REDACTED-CC]');
      
      // Remove potential SSNs
      data = data.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED-SSN]');
      
      // Remove potential API keys
      data = data.replace(/\b[a-zA-Z0-9]{32,}\b/g, (match) => {
        if (match.toLowerCase().includes('key') || match.toLowerCase().includes('token')) {
          return '[REDACTED-KEY]';
        }
        return match;
      });
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};