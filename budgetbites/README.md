# BudgetBites Production Deployment Guide
    This guide covers the complete production deployment of BudgetBites on `budgetbites.imaginabletechnologies.com`.
    ## Production Architecture
    Internet -> Nginx (SSL/Reverse Proxy) + Frontend (React) + Backend (Node.js)
                                            |
                                         PostgreSQL + Redis
    ### Services
    - **Nginx**: SSL termination, reverse proxy, static file serving
    - **Frontend**: React application served by Nginx
    - **Backend**: Node.js/Express API server
    - **PostgreSQL**: Primary database
    - **Redis**: Session storage and caching
    - **Certbot**: Automatic SSL certificate management
    ## Quick Deployment
    ### 1. Initial Setup
    ```powershell
    # Clone and navigate to project
    # Clone and navigate to project
    # Example (Windows PowerShell):
    # cd C:\projects\BudgetBites
    # Example (Linux/macOS):
    # cd ~/projects/budgetbites
    # Environment is already configured in .env file
    # Verify configuration
    Get-Content .env
    ### 2. Deploy to Production
    ```powershell
    # Full production deployment
    .\deploy-production.ps1 deploy
    # Or step by step:
    .\deploy-production.ps1 ssl    # Setup SSL certificates
    .\deploy-production.ps1 deploy # Deploy application
    ```
