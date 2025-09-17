# RentPath Infrastructure

This directory contains Terraform configuration for the RentPath Laravel application infrastructure on AWS.

## Architecture Overview

The infrastructure includes:

- **Elastic Beanstalk**: Laravel 12 application hosting with PHP 8.4
- **RDS MySQL**: Database with automated backups and monitoring
- **S3 + CloudFront**: Asset storage with CDN
- **CodePipeline**: CI/CD pipeline for automated deployments
- **VPC**: Network isolation with public and private subnets
- **Security Groups**: Least-privilege access control
- **Secrets Manager**: Secure database credential storage

## File Structure

```
infrastructure/
├── versions.tf                # Terraform and provider version constraints
├── providers.tf               # AWS provider configuration
├── variables.tf               # Input variables with validation
├── outputs.tf                 # Output values
├── locals.tf                  # Local values and computed expressions
├── data.tf                    # Data sources for existing resources
├── elastic-beanstalk.tf       # EB application and environment
├── rds.tf                     # MySQL database configuration
├── security-groups.tf         # Security group definitions
├── s3.tf                      # S3 buckets and CloudFront CDN
├── codepipeline.tf            # CI/CD pipeline configuration
├── iam.tf                     # IAM roles and policies
├── secrets.tf                 # AWS Secrets Manager configuration
├── terraform.tfvars.example   # Example configuration values
└── README.md                  # This documentation
```

## Infrastructure Components

### Elastic Beanstalk
- **Application**: PHP 8.4 on Amazon Linux 2023
- **Environment**: Load-balanced with auto-scaling
- **Instance Type**: Configurable (default: t3.medium)
- **Scaling**: Min/max instances configurable
- **Proxy**: nginx with optimized PHP settings

### RDS MySQL
- **Engine**: MySQL 8.0 with encrypted storage
- **Instance**: db.t3.micro (configurable)
- **Networking**: Private subnets only
- **Backups**: 7-day retention with automated snapshots
- **Monitoring**: Enhanced monitoring with CloudWatch
- **Security**: Auto-generated passwords stored in Secrets Manager

### S3 and CloudFront
- **Primary Bucket**: Application assets with versioning
- **Backup Bucket**: Optional separate bucket for backups
- **CDN**: CloudFront distribution for global content delivery
- **Security**: Public access blocked, CloudFront OAC enabled
- **Lifecycle**: Automated transition to IA and Glacier storage

### CodePipeline
- **Source**: GitHub integration via CodeStar connections
- **Deployment**: Direct to Elastic Beanstalk
- **Triggers**: Configurable branch-based triggers
- **Artifacts**: Stored in dedicated S3 bucket

## Prerequisites

Before deploying, ensure you have:

1. **AWS CLI configured** with appropriate permissions
2. **Terraform >= 1.0** installed
3. **Existing VPC** with public and private subnets
4. **GitHub CodeStar connection** for CI/CD pipeline
5. **Domain name** (optional) for custom URLs

## Setup Instructions

### 1. Initialize Terraform
```bash
cd infrastructure
terraform init
```

### 2. Configure Variables
```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your specific values:
- VPC ID and subnet IDs
- GitHub repository and branch
- Instance types and scaling configuration

### 3. Create Secrets Manually
**⚠️ IMPORTANT: Create the consolidated secret before running Terraform**

```bash
# Create the consolidated app-config secret with all environment variables
aws secretsmanager create-secret --name "rentpath-production/app-config" \
  --description "Consolidated application configuration for RentPath"

# Update the secret with your production values
aws secretsmanager update-secret --secret-id "rentpath-production/app-config" \
  --secret-string '{
    "APP_ENV": "production",
    "APP_DEBUG": "false",
    "APP_KEY": "base64:YOUR_LARAVEL_APP_KEY_HERE",
    "APP_NAME": "RentPath",
    "APP_URL": "https://your-domain.com",
    "CACHE_STORE": "database",
    "SESSION_DRIVER": "database",
    "QUEUE_CONNECTION": "database",
    "LOG_CHANNEL": "stack",
    "DB_CONNECTION": "mysql",
    "DB_DATABASE": "rentpath",
    "DB_USERNAME": "rentpath",
    "DB_PASSWORD": "your-secure-database-password",
    "codestar_connection_arn": "arn:aws:codeconnections:region:account:connection/your-connection-id"
  }'
```

**Generate Laravel App Key:**
```bash
# If you don't have a Laravel app key yet:
php artisan key:generate --show
# Use the generated key in the secret above
```

### 4. Validate Configuration
```bash
terraform validate
terraform plan
```

### 5. Deploy Infrastructure
```bash
terraform apply
```

The deployment will create:
- RDS MySQL database (takes ~10-15 minutes)
- Elastic Beanstalk application and environment
- S3 buckets and CloudFront distribution
- CodePipeline for automated deployments

### 6. Post-Deployment Setup

After successful deployment:

1. **Test the application** using the Elastic Beanstalk URL
2. **Configure domain** (if using custom domain)
3. **Set up monitoring** and alerts
4. **Review security groups** and access patterns

## Environment Configuration

### Secrets Management 🔒

**All sensitive data is stored in a single AWS Secrets Manager secret:**

- **Consolidated Secret**: Contains all environment variables and configuration
- **No Circular Dependencies**: Secrets are created manually before Terraform deployment
- **Environment-Specific**: All resource names include environment for multi-environment support

**How it works:**
1. **Manual Secret Creation**: Create the consolidated secret using AWS CLI before deployment
2. **Terraform Data Source**: Terraform retrieves the secret via data source (no creation)
3. **Environment Variables**: All secrets are injected into Elastic Beanstalk as environment variables
4. **No Sensitive Data in State**: No sensitive data is stored in Terraform state files or logs

**Consolidated Secret Name:**
- `{project-name}-{environment}/app-config`

**Secret Contains:**
- Laravel application settings (APP_KEY, APP_URL, APP_ENV, etc.)
- Database credentials (DB_USERNAME, DB_PASSWORD, DB_DATABASE)
- CodeStar connection ARN for CI/CD
- Cache, session, and queue configuration

### Database Connection

The RDS database credentials are:
- Stored in the consolidated app-config secret in AWS Secrets Manager
- Injected as environment variables into Elastic Beanstalk
- The database host and port are computed by Terraform and merged with the secret values

### Application Settings

Key environment variables set in Elastic Beanstalk:
- `DB_*`: Database connection details
- `APP_*`: Laravel application settings
- `CACHE_STORE`: Set to 'database'
- `SESSION_DRIVER`: Set to 'database'
- `QUEUE_CONNECTION`: Set to 'database'

## Best Practices Implemented

### Security
- **Least privilege IAM**: Minimal required permissions
- **Private databases**: RDS in private subnets only
- **Encrypted storage**: RDS and S3 encryption enabled
- **Secret management**: Database passwords in Secrets Manager
- **Security groups**: Restricted access between components

### Reliability
- **Auto-scaling**: Configurable min/max instances
- **Health monitoring**: Enhanced monitoring enabled
- **Automated backups**: 7-day RDS backup retention
- **Lifecycle policies**: S3 cost optimization rules

### Performance
- **CDN**: CloudFront for global content delivery
- **Optimized instances**: Right-sized for workload
- **Database tuning**: MySQL parameter optimization
- **Caching**: Multiple caching layers configured

## Managing State

For production deployments, use remote state:

```hcl
# In versions.tf
terraform {
  backend "s3" {
    bucket = "your-terraform-state-bucket"
    key    = "rentpath/infrastructure/terraform.tfstate"
    region = "eu-central-1"

    # Optional: Enable state locking
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}
```

## Cost Optimization

Current configuration is optimized for cost:
- **t3.micro RDS**: Suitable for development/small production
- **t3.medium EB instances**: Good performance/cost balance
- **S3 lifecycle rules**: Automatic archival to reduce storage costs
- **Single AZ RDS**: Lower cost option (can enable Multi-AZ for HA)

Estimated monthly costs (EU Central):
- RDS db.t3.micro: ~$15
- EB t3.medium (1 instance): ~$30
- S3 storage: Variable based on usage
- CloudFront: Variable based on traffic

## Monitoring and Alerting

The infrastructure includes:
- **Enhanced health monitoring** in Elastic Beanstalk
- **RDS performance insights** for database monitoring
- **CloudWatch alarms** for auto-scaling triggers
- **Application logs** in CloudWatch Logs

Consider adding:
- Custom CloudWatch dashboards
- SNS topics for alerting
- AWS X-Ray for application tracing

## Troubleshooting

Common issues and solutions:

### Deployment Failures
- Check Elastic Beanstalk events in AWS console
- Review application logs in CloudWatch
- Verify environment variables are correctly set

### Database Connection Issues
- Ensure security groups allow traffic on port 3306
- Verify database credentials in Secrets Manager
- Check VPC/subnet configuration

### Pipeline Failures
- Verify CodeStar connection is active
- Check IAM permissions for CodePipeline role
- Ensure source repository has correct branch

## Secrets Rotation

To rotate sensitive values in the consolidated secret:

### Complete Secret Update
```bash
# 1. Get current secret values
aws secretsmanager get-secret-value --secret-id rentpath-production/app-config \
  --query SecretString --output text | jq .

# 2. Update specific values and rotate the entire secret
aws secretsmanager update-secret --secret-id rentpath-production/app-config \
  --secret-string '{
    "APP_ENV": "production",
    "APP_DEBUG": "false",
    "APP_KEY": "base64:NEW_LARAVEL_KEY_HERE",
    "APP_NAME": "RentPath",
    "APP_URL": "https://your-domain.com",
    "CACHE_STORE": "database",
    "SESSION_DRIVER": "database",
    "QUEUE_CONNECTION": "database",
    "LOG_CHANNEL": "stack",
    "DB_CONNECTION": "mysql",
    "DB_DATABASE": "rentpath",
    "DB_USERNAME": "rentpath",
    "DB_PASSWORD": "NEW_SECURE_DATABASE_PASSWORD",
    "codestar_connection_arn": "arn:aws:codeconnections:region:account:connection/your-connection-id"
  }'

# 3. Deploy changes to apply new environment variables
terraform apply
```

### Individual Value Updates
```bash
# For updating just the Laravel app key:
# 1. Generate new key
php artisan key:generate --show

# 2. Update the secret with new APP_KEY value (keeping all other values the same)
# Use the complete secret update approach above with just the APP_KEY changed
```

**⚠️ Important Notes:**
- Always update the entire secret JSON when making changes
- Database password changes will require application restart
- Test changes in a development environment first
- Keep backups of working secret configurations

## Multi-Environment Support

The infrastructure is designed to support multiple environments (dev, staging, production) without conflicts:

### Environment-Specific Resources
All resource names include the environment:
- IAM roles: `rentpath-{environment}-eb-ec2-role`
- S3 buckets: `rentpath-{environment}-assets`
- CodePipeline: `rentpath-{environment}`
- Secrets: `rentpath-{environment}/app-config`

### Deploying Multiple Environments
```bash
# Development environment
cp terraform.tfvars.example terraform.tfvars.dev
# Edit terraform.tfvars.dev with development values (environment = "dev")

# Create dev secret
aws secretsmanager create-secret --name "rentpath-dev/app-config"
# ... populate with dev configuration

# Deploy dev environment
terraform apply -var-file="terraform.tfvars.dev"

# Production environment
cp terraform.tfvars.example terraform.tfvars.prod
# Edit terraform.tfvars.prod with production values (environment = "production")

# Create production secret
aws secretsmanager create-secret --name "rentpath-production/app-config"
# ... populate with production configuration

# Deploy production environment
terraform apply -var-file="terraform.tfvars.prod"
```

## Maintenance

Regular maintenance tasks:
- **Update platform version** when new versions are available
- **Rotate secrets** quarterly using consolidated secret approach
- **Monitor costs** and optimize resource usage
- **Update Terraform** and provider versions
- **Review security groups** and access patterns
- **Backup secret configurations** before making changes

## Support

For issues:
1. Check AWS CloudWatch logs and events
2. Review Terraform state for configuration drift
3. Validate variable values in terraform.tfvars
4. Test connectivity between components