# Elastic Beanstalk outputs
output "elastic_beanstalk_application_name" {
  description = "Name of the Elastic Beanstalk application"
  value       = aws_elastic_beanstalk_application.main.name
}

output "elastic_beanstalk_environment_name" {
  description = "Name of the Elastic Beanstalk environment"
  value       = aws_elastic_beanstalk_environment.main.name
}

output "elastic_beanstalk_environment_url" {
  description = "URL of the Elastic Beanstalk environment"
  value       = aws_elastic_beanstalk_environment.main.endpoint_url
}

output "elastic_beanstalk_cname" {
  description = "CNAME of the Elastic Beanstalk environment"
  value       = aws_elastic_beanstalk_environment.main.cname
}

# RDS outputs (non-sensitive only)
output "rds_port" {
  description = "RDS instance port"
  value       = aws_db_instance.main.port
}

# S3 outputs
output "s3_private_bucket_name" {
  description = "Name of the private S3 bucket"
  value       = aws_s3_bucket.private.bucket
}

output "s3_private_bucket_arn" {
  description = "ARN of the private S3 bucket"
  value       = aws_s3_bucket.private.arn
}

output "s3_public_bucket_name" {
  description = "Name of the public S3 bucket"
  value       = aws_s3_bucket.public.bucket
}

output "s3_public_bucket_arn" {
  description = "ARN of the public S3 bucket"
  value       = aws_s3_bucket.public.arn
}

output "s3_backup_bucket_name" {
  description = "Name of the backup S3 bucket"
  value       = var.s3_create_backup_bucket && length(aws_s3_bucket.backups) > 0 ? aws_s3_bucket.backups[0].bucket : null
}

# CloudFront outputs
output "cloudfront_private_domain_name" {
  description = "Domain name of the private CloudFront distribution (requires signed URLs)"
  value       = aws_cloudfront_distribution.private.domain_name
}

output "cloudfront_private_distribution_id" {
  description = "ID of the private CloudFront distribution"
  value       = aws_cloudfront_distribution.private.id
}

output "cloudfront_public_domain_name" {
  description = "Domain name of the public CloudFront distribution"
  value       = aws_cloudfront_distribution.public.domain_name
}

output "cloudfront_public_distribution_id" {
  description = "ID of the public CloudFront distribution"
  value       = aws_cloudfront_distribution.public.id
}

output "cloudfront_private_key_secret_name" {
  description = "Secrets Manager secret name containing CloudFront private key for signed URLs"
  value       = aws_secretsmanager_secret.cloudfront_private_key.name
}

# CodePipeline outputs
output "codepipeline_name" {
  description = "Name of the CodePipeline"
  value       = aws_codepipeline.main.name
}

output "codepipeline_arn" {
  description = "ARN of the CodePipeline"
  value       = aws_codepipeline.main.arn
}

# Security Group outputs
output "rds_security_group_id" {
  description = "ID of the RDS security group"
  value       = aws_security_group.rds.id
}

output "eb_ec2_security_group_id" {
  description = "ID of the Elastic Beanstalk EC2 security group"
  value       = aws_security_group.eb_ec2.id
}

# Secrets Manager outputs (non-sensitive information only)
output "secrets_manager_info" {
  description = "Non-sensitive information about secrets stored in AWS Secrets Manager"
  value = {
    app_config_secret_name = data.aws_secretsmanager_secret.app_config.name
    app_config_secret_arn  = data.aws_secretsmanager_secret.app_config.arn
  }
}

