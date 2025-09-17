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

  # Retrieve sensitive values from Secrets Manager
  app_key_secret       = data.aws_secretsmanager_secret_version.app_key.secret_string
  database_config      = jsondecode(data.aws_secretsmanager_secret_version.database_config.secret_string)
  database_password    = jsondecode(data.aws_secretsmanager_secret_version.db_password.secret_string).password
  codestar_config      = jsondecode(data.aws_secretsmanager_secret_version.codestar_connection.secret_string)
  app_config           = jsondecode(data.aws_secretsmanager_secret_version.app_config.secret_string)

  # Application environment variables (using secrets)
  app_env_vars = {
    APP_ENV          = var.environment
    APP_DEBUG        = var.app_debug
    APP_KEY          = local.app_key_secret
    APP_NAME         = var.project_name
    APP_URL          = local.app_config.app_url
    CACHE_STORE      = "database"
    SESSION_DRIVER   = "database"
    QUEUE_CONNECTION = "database"
    LOG_CHANNEL      = "stack"
  }

  # Database environment variables (using secrets)
  db_env_vars = {
    DB_CONNECTION = "mysql"
    DB_HOST       = aws_db_instance.main.endpoint
    DB_PORT       = tostring(aws_db_instance.main.port)
    DB_DATABASE   = local.database_config.database
    DB_USERNAME   = local.database_config.username
    DB_PASSWORD   = local.database_password
  }
}

