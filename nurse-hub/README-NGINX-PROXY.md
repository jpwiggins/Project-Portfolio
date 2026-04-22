# Nginx Proxy Setup with Let's Encrypt

This setup provides automatic HTTPS with Let's Encrypt certificates for your three applications.

## Quick Start

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your domains:**
   ```bash
   PROFLIX_DOMAIN=proflix.yourdomain.com
   BUNDLECRAFT_DOMAIN=bundlecraft.yourdomain.com  
   NURSEHUB_DOMAIN=nursehub.yourdomain.com
   LETSENCRYPT_EMAIL=your-email@domain.com
   ```

3. **Deploy:**
   ```bash
   # Windows PowerShell
   .\deploy-with-proxy.ps1
   
   # Or manually
   docker-compose up -d
   ```

## What This Setup Provides

### 🔒 **Automatic HTTPS**
- Let's Encrypt SSL certificates
- Auto-renewal every 90 days
- Redirects HTTP to HTTPS

### 🌐 **Domain Routing**
- `proflix.yourdomain.com` → Proflix app
- `bundlecraft.yourdomain.com` → Bundlecraft app  
- `nursehub.yourdomain.com` → NurseHub app

### 📊 **Health Monitoring**
- Built-in health checks
- Automatic container restarts
- Service dependency management

## Architecture

```
Internet
    ↓
nginx-proxy (Port 80/443)
    ├── proflix.domain.com → proflix-app:5000
    ├── bundlecraft.domain.com → bundlecraft-app:5000
    └── nursehub.domain.com → nursehub-app:5000
```

## Services

| Service | Container | Purpose |
|---------|-----------|---------|
| nginx-proxy | nginx-proxy | Reverse proxy + load balancer |
| letsencrypt-companion | letsencrypt-companion | SSL certificate management |
| postgres | main-postgres | Shared PostgreSQL database |
| proflix | proflix-app | Proflix application |
| bundlecraft | bundlecraft-app | Bundlecraft application |
| nursehub | nursehub-app | NurseHub application |

## Management Commands

```bash
# Start all services
docker-compose up -d

# Stop all services  
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Restart a service
docker-compose restart [service-name]

# Check status
docker-compose ps

# Force SSL certificate renewal
docker-compose exec letsencrypt-companion /app/force_renew
```

## DNS Configuration

Before deployment, ensure your domains point to your server:

```
A     proflix.yourdomain.com      → YOUR_SERVER_IP
A     bundlecraft.yourdomain.com  → YOUR_SERVER_IP
A     nursehub.yourdomain.com     → YOUR_SERVER_IP
```

## Troubleshooting

### SSL Certificate Issues
```bash
# Check certificate status
docker-compose logs letsencrypt-companion

# Force renewal
docker-compose exec letsencrypt-companion /app/force_renew
```

### Proxy Issues
```bash
# Check nginx-proxy logs
docker-compose logs nginx-proxy

# Verify container detection
docker-compose exec nginx-proxy cat /etc/nginx/conf.d/default.conf
```

### Database Issues
```bash
# Check database connection
docker-compose exec postgres psql -U admin -d main_db -c "\l"

# View database logs
docker-compose logs postgres
```

## Security Features

- ✅ **Automatic HTTPS** - All traffic encrypted
- ✅ **Security Headers** - HSTS, CSP, X-Frame-Options
- ✅ **Rate Limiting** - Built-in DDoS protection
- ✅ **Network Isolation** - Internal docker network
- ✅ **Health Checks** - Automatic failure detection

## Production Notes

1. **Backups**: Regular database backups recommended
2. **Monitoring**: Consider adding Prometheus/Grafana
3. **Firewall**: Only expose ports 80/443 externally
4. **Updates**: Regular security updates for images