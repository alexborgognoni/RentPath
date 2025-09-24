# Project configuration
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "rentpath"
}

variable "environment" {
  description = "Environment name (dev, test, staging, production)"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["dev", "test", "staging", "production"], var.environment)
    error_message = "Environment must be one of: dev, test, staging, production."
  }
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "eu-central-1"
}

# Network configuration
variable "vpc_id" {
  description = "VPC ID where resources will be deployed"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs for ALB"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for RDS and EC2 instances"
  type        = list(string)
}

# Elastic Beanstalk configuration
variable "eb_solution_stack" {
  description = "Elastic Beanstalk solution stack"
  type        = string
  default     = "64bit Amazon Linux 2023 v4.7.5 running PHP 8.3"
}

variable "eb_instance_type" {
  description = "EC2 instance type for Elastic Beanstalk"
  type        = string
  default     = "t3.medium"
}

variable "eb_min_size" {
  description = "Minimum number of instances"
  type        = number
  default     = 1
}

variable "eb_max_size" {
  description = "Maximum number of instances"
  type        = number
  default     = 3
}

# RDS configuration
variable "rds_engine" {
  description = "RDS database engine"
  type        = string
  default     = "mysql"
}

variable "rds_engine_version" {
  description = "RDS engine version"
  type        = string
  default     = "8.0"
}

variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "RDS maximum allocated storage in GB"
  type        = number
  default     = 100
}

variable "rds_backup_retention_period" {
  description = "RDS backup retention period in days"
  type        = number
  default     = 7
}

variable "rds_multi_az" {
  description = "Enable RDS multi-AZ deployment"
  type        = bool
  default     = false
}

variable "rds_deletion_protection" {
  description = "Enable RDS deletion protection"
  type        = bool
  default     = true
}

# S3 configuration
variable "s3_versioning_enabled" {
  description = "Enable S3 bucket versioning"
  type        = bool
  default     = true
}

variable "s3_create_backup_bucket" {
  description = "Create a separate S3 bucket for backups"
  type        = bool
  default     = true
}

# CodePipeline configuration
variable "github_repo" {
  description = "GitHub repository in format owner/repo"
  type        = string
}

variable "github_branch" {
  description = "GitHub branch for CodePipeline"
  type        = string
  default     = "main"
}

variable "eb_laravel_config" {
  description = "Laravel application configuration (non-sensitive)"
  type = object({
    # Application Configuration
    app_name                = string
    app_env                 = string
    app_debug               = bool
    app_locale              = string
    app_fallback_locale     = string
    app_faker_locale        = string
    app_maintenance_driver  = string
    php_cli_server_workers  = number
    bcrypt_rounds          = number

    # Database Configuration (non-sensitive)
    db_connection = string

    # Logging Configuration
    log_channel             = string
    log_stack              = string
    log_deprecations_channel = string
    log_level              = string

    # Session Configuration
    session_driver   = string
    session_lifetime = number
    session_encrypt  = bool
    session_path     = string
    session_domain   = string

    # Cache and Queue Configuration
    broadcast_connection = string
    filesystem_disk     = string
    queue_connection    = string
    cache_store        = string
    cache_prefix       = string

    # Redis Configuration
    redis_client = string
    redis_host   = string
    redis_port   = number

    # Mail Configuration (non-sensitive)
    mail_mailer       = string
    mail_scheme       = string
    mail_host         = string
    mail_port         = number
    mail_from_address = string
    mail_from_name    = string

    # AWS Configuration (non-sensitive)
    aws_default_region           = string
    aws_use_path_style_endpoint = bool
  })
}
