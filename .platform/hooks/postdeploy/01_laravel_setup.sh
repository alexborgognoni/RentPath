#!/bin/bash
set -e

echo "=== Laravel post-deployment setup starting ==="

APP_DIR="/var/app/current"
PHP_USER="webapp"

# Ensure storage directories exist
mkdir -p $APP_DIR/storage/framework/{sessions,views,cache,testing}
mkdir -p $APP_DIR/storage/{logs,app/public}
mkdir -p $APP_DIR/bootstrap/cache

# Set proper permissions and ownership
chmod -R 775 $APP_DIR/storage $APP_DIR/bootstrap/cache
chown -R $PHP_USER:$PHP_USER $APP_DIR/storage $APP_DIR/bootstrap/cache

cd $APP_DIR

# Clear and cache Laravel config/routes/views
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations with --force
php artisan migrate --force

# Disable maintenance mode
php artisan up

echo "=== Laravel post-deployment setup completed successfully ==="
