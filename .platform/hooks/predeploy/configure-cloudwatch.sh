#!/bin/bash
# Configure CloudWatch agent to stream Laravel logs

# Copy Laravel log configuration to CloudWatch agent
cp /var/app/staging/.platform/files/app_log.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.d/laravel.json

# Restart CloudWatch agent to pick up new configuration
systemctl restart amazon-cloudwatch-agent.service

echo "CloudWatch agent configured for Laravel logs"
