# Individual Deployment Guide for All 6 Apps

## Quick Overview
You have 6 apps that need individual deployment:
1. **BudgetBites** (Port 3001) - Current app
2. **BundleCraft** (Port 3002) 
3. **NurseHub** (Port 3003)
4. **Profileit** (Port 3004)
5. **RegReady** (Port 3005)
6. **VibeEditorAI** (Port 3006)

All apps have Stripe payment integration and most use OpenAI.

## Step 1: Create Individual Dockerfiles

Each app needs its own Dockerfile. Here's the template:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat bash curl
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache bash curl
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/package*.json ./
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
USER appuser
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -fsS http://localhost:3000/health || exit 1
CMD ["node", "dist/main.js"]
```

## Step 2: Environment Variables Template

Each app needs these variables:

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
DATABASE_URL=postgresql://postgres:password@postgres:5432/appname
REDIS_URL=redis://redis:6379
SESSION_SECRET=unique_secret_per_app
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public
OPENAI_API_KEY=your_openai_key
```

## Step 3: Docker Compose for Each App

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3000"  # Change port for each app
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/appname
    depends_on:
      - postgres
      - redis
    networks:
      - app-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=appname
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
```

## Step 4: Nginx Configuration

```nginx
# Reverse proxy for all apps
server {
    listen 443 ssl http2;
    server_name budgetbites.yourdomain.com;
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Repeat for each app with different subdomain and port
```

## Step 5: Deployment Commands

For each app:
```bash
# Build and deploy
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

Would you like me to create the specific files for each app?