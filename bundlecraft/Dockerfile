# syntax=docker/dockerfile:1.6

# ---------- Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# workspace deps
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
RUN --mount=type=cache,target=/root/.npm cd client && npm ci --no-audit --no-fund
RUN --mount=type=cache,target=/root/.npm cd server && npm ci --no-audit --no-fund

# sources
COPY . .

# build both client+server
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# keep only prod deps
RUN npm prune --production && cd server && npm prune --production

# ---------- Production (Node 20 + Nginx) ----------
FROM node:20-alpine AS production
WORKDIR /app

# add nginx for static + reverse proxy
RUN apk add --no-cache nginx curl

ENV NODE_ENV=production \
    NO_UPDATE_NOTIFIER=1 \
    NPM_CONFIG_UPDATE_NOTIFIER=false

# runtime files
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
# if server has its own node_modules, include it (safe no-op if absent)
COPY --from=build /app/server/node_modules ./server/node_modules/
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

# nginx: serve client
RUN mkdir -p /usr/share/nginx/html
COPY --from=build /app/dist/public /usr/share/nginx/html

# nginx config + starter
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY start.sh /app/start.sh
RUN sed -i 's/\r$//' /app/start.sh && chmod +x /app/start.sh

EXPOSE 80 5011

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -fsS http://127.0.0.1/api/health >/dev/null 2>&1 || exit 1

CMD ["/app/start.sh"]
