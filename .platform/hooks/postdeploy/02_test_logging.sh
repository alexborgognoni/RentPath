#!/bin/bash
# Test that Laravel logging is working

echo "=== Checking Laravel log directory ==="
ls -lah /var/app/current/storage/logs/

echo "=== Checking if log file exists ==="
if [ -f /var/app/current/storage/logs/laravel.log ]; then
    echo "Log file exists!"
    ls -lah /var/app/current/storage/logs/laravel.log
    echo "Last 5 lines of log:"
    tail -5 /var/app/current/storage/logs/laravel.log
else
    echo "Log file does NOT exist"
fi

echo "=== Checking CloudWatch agent laravel.json config ==="
cat /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.d/laravel.json

echo "=== Test logging completed ==="
