#!/bin/bash

# Run Caches

# After the deployment, it's highly recommended
# to re-run the caches for config, routes and views.

# Note: Environment variables should be set via Elastic Beanstalk configuration
# instead of downloading from S3 for better security.
# Remove S3 download and use EB environment variables instead.

# Generate app key only if it doesn't exist
if [ -z "$APP_KEY" ]; then
    echo "Warning: APP_KEY not set in environment variables"
    php artisan key:generate --force
fi

# Clear application cache
php artisan cache:clear

# Bring application back online
php artisan up

echo "Cache operations completed"
