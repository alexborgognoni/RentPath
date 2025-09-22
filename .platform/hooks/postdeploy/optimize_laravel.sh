#!/bin/bash

# Laravel Production Optimizations
# This script runs after deployment to optimize Laravel for production

echo "Starting Laravel optimization..."

# Cache Laravel configuration for better performance
php artisan config:cache
echo "Configuration cached"

# Cache routes for faster routing
php artisan route:cache
echo "Routes cached"

# Cache views for faster view compilation
php artisan view:cache
echo "Views cached"

# Cache events for better event handling performance
php artisan event:cache
echo "Events cached"

# Ensure proper permissions for cached files
chmod -R 775 bootstrap/cache
chmod -R 775 storage

echo "Laravel optimization completed successfully"