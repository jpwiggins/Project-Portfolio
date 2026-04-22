# BudgetBites Docker Setup

This repository includes Docker configurations for both frontend and backend services of the BudgetBites application.

## 🐳 Docker Files Overview

- `Dockerfile.backend` - Backend Node.js/Express application
- `Dockerfile.frontend` - Frontend React application, served by Nginx
- `docker-compose.yml` - Production setup (Nginx serves frontend on port 80)
- `docker-compose.dev.yml` - Development setup with hot reloading
- `nginx.conf` - Nginx configuration for frontend
- `.dockerignore` - Files to exclude from Docker builds
- `.env.example` - Environment variables template

## 🚀 Quick Start

### Production Setup

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your actual values.

2. **Build and run:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost (or http://localhost:80)
   - Backend API: http://localhost:5000

### Development Setup

1. **Run development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000 (with hot reloading, dev only)
   - Backend API: http://localhost:5000 (with hot reloading, dev only)
   - Database: localhost:5432
   - Redis: localhost:6379

## 📋 Available Commands

docker-compose up --build
docker-compose up -d
docker-compose down
docker-compose logs -f
docker-compose build backend
docker-compose build frontend
### Production
```bash
# Build and start all services
docker-compose up --build

# Start services in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Example: expose Nginx frontend on a different host port (edit docker-compose.yml):
#   ports:
#     - "8080:80"
# This maps http://localhost:8080 to the frontend.

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# View development logs
docker-compose -f docker-compose.dev.yml logs -f
```

docker build -f Dockerfile.backend -t budgetbites-backend .
docker build -f Dockerfile.frontend -t budgetbites-frontend .
docker run -p 5000:5000 --env-file .env budgetbites-backend
docker run -p 3000:3000 budgetbites-frontend
### Individual Services
```bash
# Build backend only
docker build -f Dockerfile.backend -t budgetbites-backend .

# Build frontend only
docker build -f Dockerfile.frontend -t budgetbites-frontend .

# Run backend container
docker run -p 5000:5000 --env-file .env budgetbites-backend

# Run frontend container (production, served by Nginx on port 80)
docker run -p 8080:80 budgetbites-frontend
# Access at http://localhost:8080
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

- **Database**: Set `DATABASE_URL` for your database connection
- **Authentication**: Set `JWT_SECRET` and `SESSION_SECRET`
- **Payment**: Configure Stripe keys if using payments
- **External APIs**: Add API keys for external services

### Database Setup

The docker-compose files include optional PostgreSQL and Redis services. Uncomment them in `docker-compose.yml` if you want to run the database in Docker.

### Custom Configuration

- **Backend Port**: Change `PORT` environment variable (default: 5000)
- **Frontend Port**: Modify nginx.conf and docker-compose.yml (default: 3000)
- **Database**: Configure connection in environment variables

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│   (React/Vite)  │────│  (Node/Express) │
│   Port: 3000    │    │   Port: 5000    │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
                    │
         ┌─────────────────┐
         │    Database     │
         │  (PostgreSQL)   │
         │   Port: 5432    │
         └─────────────────┘
```

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 5000, 5432, 6379 are available
2. **Environment variables**: Ensure `.env` file is properly configured
3. **Database connection**: Check `DATABASE_URL` format and database availability
4. **Build failures**: Clear Docker cache with `docker system prune -a`

### Debugging

```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs [service-name]

# Execute commands in running container
docker-compose exec backend sh
docker-compose exec frontend sh

# Check container resource usage
docker stats
```

### Performance Optimization

1. **Multi-stage builds**: Dockerfiles use multi-stage builds to minimize image size
2. **Layer caching**: Dependencies are installed before copying source code
3. **Non-root user**: Containers run as non-root for security
4. **Health checks**: Services include health checks for better orchestration

## 🔒 Security

- Containers run as non-root users
- Security headers configured in Nginx
- Environment variables for sensitive data
- Network isolation between services
- Regular base image updates recommended

## 📦 Production Deployment

For production deployment:

1. Use a reverse proxy (nginx/traefik) in front of the containers
2. Set up SSL/TLS certificates
3. Configure proper logging and monitoring
4. Use Docker secrets for sensitive data
5. Set up automated backups for database
6. Configure resource limits and health checks

## 🤝 Contributing

When adding new features:

1. Update Dockerfiles if new dependencies are added
2. Update environment variable templates
3. Test both development and production Docker setups
4. Update this README with any new configuration options