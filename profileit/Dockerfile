# Use Node.js 22 Alpine with latest security fixes (includes CVE-2023-44487 fix)
# Fixes: CVE-2023-44487, CVE-2025-22871, CVE-2024-21538, and other security vulnerabilities
FROM node:22-alpine

# Update Alpine packages and install curl for healthcheck
# Latest Alpine includes updated Python setuptools (fixes CVE-2024-6345)
RUN apk update && apk upgrade && apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (skip postinstall script)
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build the application (updated to remove Vite dependency)
RUN npm run build

# Remove dev dependencies after build to reduce attack surface
RUN npm prune --omit=dev

# Expose port
EXPOSE 5000

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Ensure Express is used for serving the application
CMD ["node", "dist/index.js"]
