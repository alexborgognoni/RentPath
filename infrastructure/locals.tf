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

  # Application environment variables
  app_env_vars = {
    APP_ENV           = var.environment
    APP_DEBUG         = var.app_debug
    APP_KEY           = var.app_key
    APP_NAME          = var.project_name
    APP_URL           = var.app_url
    CACHE_STORE       = "database"
    SESSION_DRIVER    = "database"
    QUEUE_CONNECTION  = "database"
    LOG_CHANNEL       = "stack"
  }

  # Database environment variables
  db_env_vars = {
    DB_CONNECTION = "mysql"
    DB_HOST       = aws_db_instance.main.endpoint
    DB_PORT       = tostring(aws_db_instance.main.port)
    DB_DATABASE   = aws_db_instance.main.db_name
    DB_USERNAME   = aws_db_instance.main.username
    DB_PASSWORD   = random_password.db_password.result
  }
}