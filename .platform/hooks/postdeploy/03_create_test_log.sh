#!/bin/bash
# Create a test log entry to verify CloudWatch streaming

cd /var/app/current

# Create a test log entry using Laravel's artisan
sudo -u webapp php artisan tinker --execute="Log::info('CloudWatch test log entry - deployment at ' . now());"

echo "=== Test log entry created ==="
