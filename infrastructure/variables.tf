# ==============================================================================
# TERRAFORM VARIABLES FOR RENTPATH INFRASTRUCTURE
# ==============================================================================
#
# SECRETS MANAGEMENT:
# The following sensitive values are now managed via AWS Secrets Manager:
# - app_key: Laravel application encryption key
# - app_url: Application URL
# - database username: RDS database username
# - database name: RDS database name
# - codestar_connection_arn: GitHub CodeStar connection ARN
#
# These secrets are automatically retrieved via data sources in data.tf
# and applied via locals in locals.tf. See secrets.tf for secret definitions.
#
# ==============================================================================

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
  default     = "64bit Amazon Linux 2023 v4.7.5 running PHP 8.4"
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

# Application configuration
# NOTE: app_key is now managed via AWS Secrets Manager
# Use the secrets.tf file to manage the app-key secret
variable "app_key" {
  description = "[DEPRECATED] Laravel application key - now managed via AWS Secrets Manager"
  type        = string
  default     = null
  sensitive   = true

  validation {
    condition     = var.app_key == null || can(regex("^base64:", var.app_key))
    error_message = "App key must start with 'base64:' prefix or be null (recommended: use Secrets Manager)."
  }
}

variable "app_debug" {
  description = "Enable Laravel debug mode"
  type        = string
  default     = "false"
}

# NOTE: app_url is now managed via AWS Secrets Manager
# Use the secrets.tf file to manage the app-config secret
variable "app_url" {
  description = "[DEPRECATED] Application URL - now managed via AWS Secrets Manager"
  type        = string
  default     = null
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

# NOTE: rds_database_name is now managed via AWS Secrets Manager
# Use the secrets.tf file to manage the database-config secret
variable "rds_database_name" {
  description = "[DEPRECATED] RDS database name - now managed via AWS Secrets Manager"
  type        = string
  default     = "rentpath"
  sensitive   = true

  validation {
    condition     = can(regex("^[a-zA-Z][a-zA-Z0-9_]*$", var.rds_database_name))
    error_message = "Database name must start with a letter and contain only alphanumeric characters and underscores."
  }
}

# NOTE: rds_database_username is now managed via AWS Secrets Manager
# Use the secrets.tf file to manage the database-config secret
variable "rds_database_username" {
  description = "[DEPRECATED] RDS database username - now managed via AWS Secrets Manager"
  type        = string
  default     = "rentpath"
  sensitive   = true

  validation {
    condition     = can(regex("^[a-zA-Z][a-zA-Z0-9_]*$", var.rds_database_username))
    error_message = "Database username must start with a letter and contain only alphanumeric characters and underscores."
  }
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

# NOTE: codestar_connection_arn is now managed via AWS Secrets Manager
# Use the secrets.tf file to manage the codestar-connection secret
variable "codestar_connection_arn" {
  description = "[DEPRECATED] CodeStar connection ARN for GitHub - now managed via AWS Secrets Manager"
  type        = string
  default     = null
}
