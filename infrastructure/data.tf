# Get current AWS account and region
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Get latest PHP 8.4 platform version for Elastic Beanstalk
data "aws_elastic_beanstalk_solution_stack" "php" {
  most_recent = true
  name_regex  = "^64bit Amazon Linux .* running PHP 8\\.4$"
}

# Get availability zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Get VPC information
data "aws_vpc" "main" {
  id = var.vpc_id
}

data "aws_vpc" "selected" {
  id = var.vpc_id
}

# Get subnet information
data "aws_subnets" "public" {
  filter {
    name   = "vpc-id"
    values = [var.vpc_id]
  }
  filter {
    name   = "subnet-id"
    values = var.public_subnet_ids
  }
}

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [var.vpc_id]
  }
  filter {
    name   = "subnet-id"
    values = var.private_subnet_ids
  }
}

# ==============================================================================
# SECRETS MANAGER DATA SOURCES
# ==============================================================================

# Data source for Laravel application key
data "aws_secretsmanager_secret" "app_key" {
  name = "${local.name_prefix}/app-key"
}

data "aws_secretsmanager_secret_version" "app_key" {
  secret_id = data.aws_secretsmanager_secret.app_key.id
}

# Data source for database configuration
data "aws_secretsmanager_secret" "database_config" {
  name = "${local.name_prefix}/database-config"
}

data "aws_secretsmanager_secret_version" "database_config" {
  secret_id = data.aws_secretsmanager_secret.database_config.id
}

# Data source for auto-generated database password
data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = aws_secretsmanager_secret.db_password.id
}

# Data source for CodeStar connection configuration
data "aws_secretsmanager_secret" "codestar_connection" {
  name = "${local.name_prefix}/codestar-connection"
}

data "aws_secretsmanager_secret_version" "codestar_connection" {
  secret_id = data.aws_secretsmanager_secret.codestar_connection.id
}

# Data source for application configuration
data "aws_secretsmanager_secret" "app_config" {
  name = "${local.name_prefix}/app-config"
}

data "aws_secretsmanager_secret_version" "app_config" {
  secret_id = data.aws_secretsmanager_secret.app_config.id
}

