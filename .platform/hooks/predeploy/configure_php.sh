#!/bin/bash
# Copy custom PHP configuration before deployment

set -e

echo "=== Copying custom PHP configuration ==="
cp /var/app/staging/.platform/php/conf.d/99-custom.ini /etc/php.d/99-custom.ini
chmod 644 /etc/php.d/99-custom.ini

echo "=== Restarting PHP-FPM to apply new configuration ==="
systemctl restart php-fpm.service

echo "=== Verifying PHP configuration ==="
php -r "echo 'upload_max_filesize: ' . ini_get('upload_max_filesize') . PHP_EOL;"
php -r "echo 'post_max_size: ' . ini_get('post_max_size') . PHP_EOL;"

echo "=== PHP configuration applied successfully ==="
