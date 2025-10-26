#!/bin/bash
# Test that Laravel logging is working

echo "=== Checking Laravel log file ==="
ls -lah /var/app/current/storage/logs/ || echo "Storage logs directory not found"

echo "=== Checking CloudWatch agent status ==="
systemctl status amazon-cloudwatch-agent.service --no-pager || echo "CloudWatch agent not running"

echo "=== CloudWatch agent config ==="
ls -lah /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.d/ || echo "Config directory not found"

echo "=== Test logging completed ==="
