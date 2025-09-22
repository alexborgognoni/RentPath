# Elastic Beanstalk Platform Configuration

## Production-Ready Configuration for Laravel 12 + Inertia + React 19

This configuration provides a clean, simple, and production-optimized setup for deploying your Laravel application with Inertia.js and React 19 to AWS Elastic Beanstalk.

### Structure

```
.platform/
├── files/
│   └── php.ini              # Production PHP settings
├── nginx/
│   └── conf.d/
│       └── laravel.conf     # Nginx optimization for Laravel + Inertia
└── README.md               # This file

.ebextensions/
└── 01_laravel.config       # Laravel deployment configuration
```

### Features

**PHP Configuration (`files/php.ini`):**
- 512M memory limit for Laravel + React builds
- OPcache enabled with production settings
- Optimized upload sizes and execution time
- Production error handling

**Nginx Configuration (`nginx/conf.d/laravel.conf`):**
- Gzip compression for assets
- Static file caching with 1-year expiry
- Security headers for Inertia.js
- Laravel routing support

**Deployment Configuration (`.ebextensions/01_laravel.config`):**
- Composer install with production optimizations
- npm build process for React assets
- Laravel caching (config, routes, views)
- Database migrations
- Proper file permissions

### Deployment Process

1. **Composer Install** - Production dependencies only
2. **npm Install & Build** - React/Inertia frontend assets
3. **Laravel Setup** - Cache configuration and routes
4. **Database Migration** - Run pending migrations
5. **Permissions** - Set proper directory permissions

### Security

- No sensitive data in configuration files
- Production error handling (no debug output)
- Security headers for web security
- Proper file permissions

### Performance

- OPcache enabled for PHP performance
- Nginx gzip compression
- Static asset caching
- Laravel route/view caching
- Optimized buffer sizes

This configuration replaces the previous complex hook system with a simple, maintainable setup that follows AWS Elastic Beanstalk best practices.