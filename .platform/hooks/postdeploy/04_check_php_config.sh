#!/bin/bash
# Check PHP configuration

echo "=== PHP upload_max_filesize ==="
php -r "echo ini_get('upload_max_filesize');"
echo ""

echo "=== PHP post_max_size ==="
php -r "echo ini_get('post_max_size');"
echo ""

echo "=== All PHP upload settings ==="
php -i | grep -E "upload_max_filesize|post_max_size|memory_limit|max_execution_time"

echo "=== Loaded PHP config files ==="
php --ini

echo "=== Custom config file exists? ==="
ls -la /etc/php.d/99-custom.ini || echo "Not found in /etc/php.d/"
ls -la /etc/php-8.3.d/99-custom.ini || echo "Not found in /etc/php-8.3.d/"
