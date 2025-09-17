# Local values for common tags and naming
locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }

  name_prefix = "${var.project_name}-${var.environment}"

  # Database configuration
  db_port = 3306

  # Retrieve all configuration from consolidated app-config secret
  app_config = jsondecode(data.aws_secretsmanager_secret_version.app_config.secret_string)

  # Merge all environment variables from app-config secret with computed values
  environment_variables = merge(
    local.app_config,
    {
      # Add computed database connection values
      DB_HOST = aws_db_instance.main.endpoint
      DB_PORT = tostring(aws_db_instance.main.port)
    }
  )
}

