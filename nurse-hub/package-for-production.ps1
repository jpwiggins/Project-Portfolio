# Package NurseHub for production deployment
Write-Host "📦 Packaging NurseHub for Production" -ForegroundColor Green

# Create production package directory
$prodDir = "nursehub-production-$(Get-Date -Format 'yyyy-MM-dd')"
New-Item -ItemType Directory -Path $prodDir -Force

# Copy essential files
Write-Host "📋 Copying files..." -ForegroundColor Yellow
Copy-Item "package.json" $prodDir
Copy-Item "package-lock.json" $prodDir
Copy-Item ".env" $prodDir
Copy-Item "dist" $prodDir -Recurse
Copy-Item "server/dist" "$prodDir/server" -Recurse
Copy-Item "Dockerfile.simple-prod" "$prodDir/Dockerfile" 
Copy-Item "docker-compose.prod.yml" $prodDir

# Create startup script
@"
# NurseHub Production Startup
echo "Starting NurseHub..."
npm ci --only=production
npm start
"@ | Out-File "$prodDir/start.sh" -Encoding UTF8

@"
@echo off
echo Starting NurseHub...
npm ci --only=production
npm start
"@ | Out-File "$prodDir/start.bat" -Encoding UTF8

# Create README
@"
# NurseHub Production Package

## Quick Start
1. npm ci --only=production
2. npm start
3. Open http://localhost:3006

## Docker Deployment
1. docker build -t nursehub .
2. docker run -d -p 3006:3006 nursehub

## Environment
- Requires Node.js 18+
- Uses port 3006
- Health check: /health endpoint
"@ | Out-File "$prodDir/README.md" -Encoding UTF8

Write-Host "✅ Production package created: $prodDir" -ForegroundColor Green
Write-Host "📁 Ready to transfer to production server!" -ForegroundColor Cyan