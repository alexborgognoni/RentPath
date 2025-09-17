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
variable "app_key" {
  description = "Laravel application key"
  type        = string
  sensitive   = true
}

variable "app_debug" {
  description = "Enable Laravel debug mode"
  type        = string
  default     = "false"
}

variable "app_url" {
  description = "Application URL"
  type        = string
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

variable "rds_database_name" {
  description = "RDS database name"
  type        = string
  default     = "rentpath"
}

variable "rds_database_username" {
  description = "RDS database username"
  type        = string
  default     = "rentpath"
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
  default     = "alexborgognoni/RentPath"
}

variable "github_branch" {
  description = "GitHub branch for CodePipeline"
  type        = string
  default     = "main"
}

variable "codestar_connection_arn" {
  description = "CodeStar connection ARN for GitHub"
  type        = string
}
