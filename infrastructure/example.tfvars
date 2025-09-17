# Project configuration
project_name = "rentpath"
environment  = "production"
aws_region   = "eu-central-1"

# Network configuration (replace with your actual values)
vpc_id             = "vpc-xxxxxxxxx"
public_subnet_ids  = ["subnet-xxxxxxxxx", "subnet-yyyyyyyyy"]
private_subnet_ids = ["subnet-zzzzzzzzz", "subnet-aaaaaaaaa"]

# Elastic Beanstalk configuration
eb_solution_stack = "64bit Amazon Linux 2023 v4.7.5 running PHP 8.4"
eb_instance_type  = "t3.medium"
eb_min_size       = 1
eb_max_size       = 3

# Application configuration
app_key   = "base64:your-app-key-here"
app_debug = "false"
app_url   = "https://your-domain.com"

# RDS configuration
rds_engine                  = "mysql"
rds_engine_version          = "8.0"
rds_instance_class          = "db.t3.micro"
rds_database_name           = "rentpath"
rds_database_username       = "rentpath"
db_allocated_storage        = 20
db_max_allocated_storage    = 100
rds_backup_retention_period = 7
rds_multi_az                = false
rds_deletion_protection     = true

# S3 configuration
s3_versioning_enabled   = true
s3_create_backup_bucket = true

# CodePipeline configuration
github_repo             = "alexborgognoni/RentPath"
github_branch           = "main"
codestar_connection_arn = "arn:aws:codeconnections:eu-central-1:123456789012:connection/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
