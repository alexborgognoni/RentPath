#!/bin/bash
set -e

echo "=== Laravel post-deployment setup starting ==="

APP_DIR="/var/app/current"

# Determine the PHP-FPM user (default to webapp)
PHP_USER=$(ps -eo user,comm | grep php-fpm | grep -v root | head -n1 | awk '{print $1}')
if [ -z "$PHP_USER" ]; then
    PHP_USER="webapp"
fi

# Ensure storage directories exist
mkdir -p $APP_DIR/storage/framework/{sessions,views,cache,testing}
mkdir -p $APP_DIR/storage/{logs,app/public}
mkdir -p $APP_DIR/bootstrap/cache

# Set proper permissions
chmod -R 775 $APP_DIR/storage
chmod -R 775 $APP_DIR/bootstrap/cache

# Set proper ownership
chown -R $PHP_USER:$PHP_USER $APP_DIR/storage
chown -R $PHP_USER:$PHP_USER $APP_DIR/bootstrap/cache

# Ensure .env exists
if [ ! -f "$APP_DIR/.env" ]; then
    echo "Warning: .env file missing in $APP_DIR"
fi

# Clear Laravel caches
cd $APP_DIR
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run database migrations
php artisan migrate --force

# Cache for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optional: disable maintenance mode
php artisan up

echo "=== Laravel post-deployment setup completed successfully ==="
