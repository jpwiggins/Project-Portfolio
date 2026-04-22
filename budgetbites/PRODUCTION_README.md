# 🚀 BudgetBites Production Deployment Guide

This guide covers the complete production deployment of BudgetBites on `budgetbites.imaginabletechnologies.com`.

## 🏗️ Production Architecture

```
Internet → Nginx (SSL/Reverse Proxy) → Frontend (React) + Backend (Node.js)
                                     ↓
                              PostgreSQL + Redis
```

### Services

- **Nginx**: SSL termination, reverse proxy, static file serving
- **Frontend**: React application served by Nginx
- **Backend**: Node.js/Express API server
- **PostgreSQL**: Primary database
- **Redis**: Session storage and caching
- **Certbot**: Automatic SSL certificate management

## 🚀 Quick Deployment

### 1. Initial Setup

```powershell
# Clone and navigate to project
# Clone and navigate to project
# Example (Windows PowerShell):
#   cd C:\projects\BudgetBites
# Example (Linux/macOS):
#   cd ~/projects/BudgetBites

# Environment is already configured in .env file
# Verify configuration
Get-Content .env
### 2. Deploy to Production

```powershell
# Full production deployment
.\deploy-production.ps1 deploy

# Or step by step:
.\deploy-production.ps1 ssl      # Setup SSL certificates
.\deploy-production.ps1 deploy   # Deploy application
```

### 3. Verify Deployment

```powershell
# Check status
.\deploy-production.ps1 status

# Monitor health
.\monitor.ps1 health
```

## 🌐 Access Points

- **Production Site**: <https://budgetbites.imaginabletechnologies.com>
- **API Health**: <https://budgetbites.imaginabletechnologies.com/api/health>
- **Admin Email**: <admin@imaginabletechnologies.com>

## 📋 Management Commands

### Deployment Management

```powershell
.\deploy-production.ps1 deploy   # Full deployment
.\deploy-production.ps1 ssl      # Setup/renew SSL
.\deploy-production.ps1 backup   # Create backup
.\deploy-production.ps1 status   # Check status
.\deploy-production.ps1 logs     # View logs
.\deploy-production.ps1 update   # Update application
```

### Monitoring & Maintenance

```powershell
.\monitor.ps1 health       # Health check
.\monitor.ps1 performance  # Performance metrics
.\monitor.ps1 logs         # Recent logs
.\monitor.ps1 alerts       # Check alerts
.\monitor.ps1 cleanup      # Clean unused resources
.\monitor.ps1 ssl-renew    # Renew SSL certificates
```

### Docker Commands

```powershell
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend

# Scale services (if needed)
docker-compose up -d --scale backend=2
```

## 🔧 Configuration Details

### Environment Variables

All production configuration is in `.env`:

- **Database**: PostgreSQL with user `imaginabletechnologies`
- **Redis**: Password-protected cache
- **SSL**: Let's Encrypt certificates
- **Domain**: `budgetbites.imaginabletechnologies.com`
- **Stripe**: Live payment processing
- **OpenAI**: AI-powered features

### Security Features

- ✅ SSL/TLS encryption (Let's Encrypt)
- ✅ Security headers (HSTS, CSP, etc.)
- ✅ Rate limiting on API endpoints
- ✅ Non-root container users
- ✅ Network isolation
- ✅ Password-protected Redis
- ✅ Database connection encryption

### Performance Optimizations

- ✅ Nginx reverse proxy with caching
- ✅ Gzip compression
- ✅ Static asset caching (1 year)
- ✅ Connection pooling
- ✅ Redis session storage
- ✅ Multi-stage Docker builds

## 📊 Monitoring & Alerts

### Health Checks

- Container health checks every 30s
- API endpoint monitoring
- Database connection monitoring
- SSL certificate expiry monitoring

### Performance Monitoring

```powershell
# Real-time stats
docker stats

# Resource usage
.\monitor.ps1 performance

# Database performance
docker-compose exec db psql -U imaginabletechnologies -d imaginabletechnologies -c "SELECT * FROM pg_stat_activity;"
```

### Log Management

```powershell
# Application logs
docker-compose logs backend frontend

# Nginx access logs
docker-compose exec nginx tail -f /var/log/nginx/access.log

# Database logs
docker-compose logs db
```

## 🔄 Backup & Recovery

### Automated Backups

```powershell
# Create full backup
.\deploy-production.ps1 backup

# Backups include:
# - PostgreSQL database dump
# - Redis data
# - Application data volumes
```

### Restore from Backup

```powershell
# Restore from specific backup
.\deploy-production.ps1 restore -BackupFile "backups/db_backup_2024-01-01_12-00-00.sql"
```

### Backup Schedule

Set up automated backups using Windows Task Scheduler:

```powershell
# Daily backup at 2 AM
schtasks /create /tn "BudgetBites Backup" /tr "powershell.exe -File 'C:\path\to\deploy-production.ps1' backup" /sc daily /st 02:00
```

## 🚨 Troubleshooting

### Common Issues

#### 1. SSL Certificate Issues

```powershell
# Check certificate status
.\monitor.ps1 ssl-renew

# Manual certificate renewal
docker-compose run --rm certbot renew
docker-compose exec nginx nginx -s reload
```

#### 2. Database Connection Issues

```powershell
# Check database health
docker-compose exec db pg_isready -U imaginabletechnologies

# View database logs
docker-compose logs db

# Connect to database
docker-compose exec db psql -U imaginabletechnologies -d imaginabletechnologies
```

#### 3. High Resource Usage

```powershell
# Check resource usage
.\monitor.ps1 alerts

# Clean up unused resources
.\monitor.ps1 cleanup

# Restart services
docker-compose restart
```

#### 4. Application Errors

```powershell
# Check application logs
docker-compose logs backend frontend

# Check API health
curl https://budgetbites.imaginabletechnologies.com/api/health

# Restart backend
docker-compose restart backend
```

### Emergency Procedures

#### 1. Complete System Restart

```powershell
docker-compose down
docker-compose up -d
```

#### 2. Rollback Deployment

```powershell
# Restore from backup
.\deploy-production.ps1 restore -BackupFile "backups/latest_backup.sql"
```

#### 3. Scale Up Resources

```powershell
# Add more backend instances
docker-compose up -d --scale backend=3
```

## 🔐 Security Checklist

- ✅ SSL certificates configured and auto-renewing
- ✅ Security headers implemented
- ✅ Rate limiting configured
- ✅ Database passwords secured
- ✅ API keys in environment variables
- ✅ Non-root container users
- ✅ Network segmentation
- ✅ Regular security updates

## 📈 Performance Benchmarks

### Expected Performance

- **Response Time**: < 200ms for API calls
- **Page Load**: < 2s for initial load
- **Concurrent Users**: 1000+ supported
- **Database**: < 10ms query time
- **Uptime**: 99.9% target

### Optimization Tips

1. Monitor resource usage regularly
2. Clean up unused Docker resources
3. Optimize database queries
4. Use Redis caching effectively
5. Monitor SSL certificate expiry

## 🤝 Support & Maintenance

### Regular Maintenance Tasks

- [ ] Weekly: Check system health and performance
- [ ] Monthly: Review logs and clean up resources
- [ ] Quarterly: Update dependencies and security patches
- [ ] Annually: Review and update SSL certificates

### Contact Information

- **Technical Support**: <admin@imaginabletechnologies.com>
- **Domain**: budgetbites.imaginabletechnologies.com
- **Monitoring**: Use provided scripts for health checks

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [PostgreSQL Administration](https://www.postgresql.org/docs/)
- [Redis Administration](https://redis.io/documentation)

---

**🎉 Your BudgetBites application is now ready for production!**

Visit: <https://budgetbites.imaginabletechnologies.com>