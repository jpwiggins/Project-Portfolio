# Use Node.js 22 Alpine (secure, lightweight)
FROM node:22-alpine

# Update Alpine packages and install curl for healthcheck
RUN apk update && apk upgrade && apk add --no-cache curl

# Create non-root user for security EARLY
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nursehub -u 1001 -G nodejs

# Set working directory and change ownership immediately
WORKDIR /app
RUN chown nursehub:nodejs /app

# Switch to non-root user BEFORE copying files
USER nursehub

# Copy package manifests first for better caching
COPY --chown=nursehub:nodejs package*.json ./

# Install all dependencies (including dev) for build
RUN npm install --legacy-peer-deps --ignore-scripts

# Copy full source code with correct ownership
COPY --chown=nursehub:nodejs . .

# Build the app using your production script
RUN npm run build

# Remove dev dependencies to slim down image
RUN npm prune --omit=dev --legacy-peer-deps || echo "Prune completed with warnings"

# Expose the correct port (matches your reverse proxy config)
EXPOSE 5000

# Healthcheck (your app provides /health)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the app
CMD ["node", "server/dist/index.js"]
