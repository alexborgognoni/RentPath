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
- CodeStar connection ARN
- Application key and URL
- Database and S3 configuration

### 3. Validate Configuration
```bash
terraform validate
terraform plan
```

### 4. Deploy Infrastructure
```bash
terraform apply
```

The deployment will create:
- RDS MySQL database (takes ~10-15 minutes)
- Elastic Beanstalk application and environment
- S3 buckets and CloudFront distribution
- CodePipeline for automated deployments

### 5. Post-Deployment Setup

After successful deployment:

1. **Test the application** using the Elastic Beanstalk URL
2. **Configure domain** (if using custom domain)
3. **Set up monitoring** and alerts
4. **Review security groups** and access patterns

## Environment Configuration

### Secrets Management 🔒

**Sensitive data is automatically stored in AWS Secrets Manager:**

- **Application Key**: Laravel encryption key
- **Database Username**: RDS database username
- **Database Name**: RDS database name
- **Database Password**: Auto-generated and rotated

**How it works:**
1. During initial deployment, sensitive variables are stored as secrets
2. Terraform retrieves secrets via data sources for subsequent deployments
3. Secrets are injected into Elastic Beanstalk as environment variables
4. No sensitive data is stored in state files or logs

**Secret Names:**
- `{project-name}-{environment}/app-key`
- `{project-name}-{environment}/database-config`
- `{project-name}-{environment}/app-config`
- `{project-name}-{environment}/codestar-connection`
- `{project-name}-{environment}-db-password`

### Database Connection

The RDS database credentials are automatically:
- Generated as random passwords
- Stored in AWS Secrets Manager
- Injected as environment variables into Elastic Beanstalk

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

To rotate sensitive values:

### Application Key Rotation
```bash
# 1. Generate new key in Laravel
php artisan key:generate --show

# 2. Update secret in AWS
aws secretsmanager update-secret --secret-id rentpath-production/app-key \
  --secret-string "base64:NEW_KEY_HERE"

# 3. Deploy changes
terraform apply
```

### Database Credentials Rotation
```bash
# 1. Update database config secret
aws secretsmanager update-secret --secret-id rentpath-production/database-config \
  --secret-string '{"username":"new_user","database":"new_db","engine":"mysql","port":3306}'

# 2. Deploy changes (will recreate RDS instance)
terraform apply
```

### Database Password Rotation
```bash
# Password rotation is handled automatically by AWS
# Or manually trigger:
aws secretsmanager rotate-secret --secret-id rentpath-production/db-password
```

## Maintenance

Regular maintenance tasks:
- **Update platform version** when new versions are available
- **Rotate secrets** quarterly using above procedures
- **Monitor costs** and optimize resource usage
- **Update Terraform** and provider versions
- **Review security groups** and access patterns

## Support

For issues:
1. Check AWS CloudWatch logs and events
2. Review Terraform state for configuration drift
3. Validate variable values in terraform.tfvars
4. Test connectivity between components