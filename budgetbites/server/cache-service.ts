import { LRUCache } from 'lru-cache';

// Production-ready cache configuration with memory management
const cacheConfig = {
  max: 1000, // Maximum number of items
  maxSize: 50 * 1024 * 1024, // 50MB total cache size
  ttl: 1000 * 60 * 30, // 30 minutes TTL
  allowStaleOnFetchFailure: true,
  allowStaleOnFetchAbort: true,
  ignoreFetchAbort: true,
  sizeCalculation: (value: any, key: string) => {
    // Calculate approximate size for memory management
    return JSON.stringify(value).length + key.length;
  },
  // Enable disposal for cleanup
  dispose: (value: any, key: string, reason: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cache disposal: ${key} (reason: ${reason})`);
    }
  }
};

// API Response Cache - for caching API responses
export const apiCache = new LRUCache<string, any>(cacheConfig);

// Static Asset Cache - for caching static files metadata
export const assetCache = new LRUCache<string, any>({
  ...cacheConfig,
  max: 500,
  ttl: 1000 * 60 * 60 * 24, // 24 hours for static assets
});

// User Session Cache - for caching user-specific data
export const sessionCache = new LRUCache<string, any>({
  ...cacheConfig,
  max: 2000,
  ttl: 1000 * 60 * 60, // 1 hour for session data
});

// Database Query Cache - for caching database results
export const dbCache = new LRUCache<string, any>({
  ...cacheConfig,
  max: 500,
  ttl: 1000 * 60 * 15, // 15 minutes for DB queries
});

// Cache wrapper for API responses
export function cacheApiResponse(key: string, data: any, customTTL?: number): void {
  const options = customTTL ? { ttl: customTTL } : {};
  apiCache.set(key, data, options);
}

// Get cached API response
export function getCachedApiResponse(key: string): any | undefined {
  return apiCache.get(key);
}

// Cache wrapper for database queries
export function cacheDbQuery(key: string, data: any, customTTL?: number): void {
  const options = customTTL ? { ttl: customTTL } : {};
  dbCache.set(key, data, options);
}

// Get cached database query
export function getCachedDbQuery(key: string): any | undefined {
  return dbCache.get(key);
}

// Health check for cache
export function getCacheStats() {
  return {
    api: {
      size: apiCache.size,
      calculatedSize: apiCache.calculatedSize,
      remainingTTL: apiCache.ttl
    },
    assets: {
      size: assetCache.size,
      calculatedSize: assetCache.calculatedSize,
      remainingTTL: assetCache.ttl
    },
    sessions: {
      size: sessionCache.size,
      calculatedSize: sessionCache.calculatedSize,
      remainingTTL: sessionCache.ttl
    },
    database: {
      size: dbCache.size,
      calculatedSize: dbCache.calculatedSize,
      remainingTTL: dbCache.ttl
    }
  };
}

// Clear all caches
export function clearAllCaches(): void {
  apiCache.clear();
  assetCache.clear();
  sessionCache.clear();
  dbCache.clear();
}

// Memory monitoring - prevents memory leaks
export function monitorCacheMemory(): void {
  const stats = getCacheStats();
  const totalSize = stats.api.calculatedSize + stats.assets.calculatedSize + 
                   stats.sessions.calculatedSize + stats.database.calculatedSize;
  
  // Log memory usage in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Cache memory usage: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
  }
  
  // Auto-cleanup if approaching memory limits
  if (totalSize > 40 * 1024 * 1024) { // 40MB threshold
    console.warn('Cache approaching memory limit, performing cleanup...');
    
    // Clear oldest entries from each cache
    apiCache.purgeStale();
    assetCache.purgeStale();
    sessionCache.purgeStale();
    dbCache.purgeStale();
  }
}

// Set up periodic memory monitoring (every 5 minutes)
if (process.env.NODE_ENV === 'production') {
  setInterval(monitorCacheMemory, 5 * 60 * 1000);
}
