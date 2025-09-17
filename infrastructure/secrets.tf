# AWS Secrets Manager resources for sensitive application data

# ==============================================================================
# APPLICATION SECRETS
# ==============================================================================

# Laravel application key secret
resource "aws_secretsmanager_secret" "app_key" {
  name        = "${local.name_prefix}/app-key"
  description = "Laravel application encryption key"

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-app-key"
    Type = "application"
  })
}

resource "aws_secretsmanager_secret_version" "app_key" {
  secret_id     = aws_secretsmanager_secret.app_key.id
  secret_string = var.app_key
}

# ==============================================================================
# DATABASE SECRETS
# ==============================================================================

# Database configuration secret (contains username and database name)
resource "aws_secretsmanager_secret" "database_config" {
  name        = "${local.name_prefix}/database-config"
  description = "Database configuration including username and database name"

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-database-config"
    Type = "database"
  })
}

resource "aws_secretsmanager_secret_version" "database_config" {
  secret_id = aws_secretsmanager_secret.database_config.id
  secret_string = jsonencode({
    username     = var.rds_database_username
    database     = var.rds_database_name
    engine       = var.rds_engine
    port         = local.db_port
  })
}

# Note: Database password secret is already created in rds.tf
# This consolidates the database credentials in one place

# ==============================================================================
# INTEGRATION SECRETS
# ==============================================================================

# CodeStar connection ARN for GitHub integration
resource "aws_secretsmanager_secret" "codestar_connection" {
  name        = "${local.name_prefix}/codestar-connection"
  description = "CodeStar connection ARN for GitHub integration"

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-codestar-connection"
    Type = "integration"
  })
}

resource "aws_secretsmanager_secret_version" "codestar_connection" {
  secret_id     = aws_secretsmanager_secret.codestar_connection.id
  secret_string = var.codestar_connection_arn
}

# Application URL configuration
resource "aws_secretsmanager_secret" "app_config" {
  name        = "${local.name_prefix}/app-config"
  description = "Application configuration including URL and environment settings"

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-app-config"
    Type = "application"
  })
}

resource "aws_secretsmanager_secret_version" "app_config" {
  secret_id = aws_secretsmanager_secret.app_config.id
  secret_string = jsonencode({
    app_url     = var.app_url
    environment = var.environment
    debug_mode  = var.app_debug
  })
}