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
output "s3_bucket_name" {
  description = "Name of the main S3 bucket"
  value       = aws_s3_bucket.main.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the main S3 bucket"
  value       = aws_s3_bucket.main.arn
}

output "s3_backup_bucket_name" {
  description = "Name of the backup S3 bucket"
  value       = var.s3_create_backup_bucket && length(aws_s3_bucket.backups) > 0 ? aws_s3_bucket.backups[0].bucket : null
}

# CloudFront outputs
output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = var.s3_use_cloudfront && length(aws_cloudfront_distribution.main) > 0 ? aws_cloudfront_distribution.main[0].domain_name : null
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = var.s3_use_cloudfront && length(aws_cloudfront_distribution.main) > 0 ? aws_cloudfront_distribution.main[0].id : null
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

