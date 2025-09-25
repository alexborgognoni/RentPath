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

  # Retrieve all sensitive configuration from app-config secret
  app_config = jsondecode(data.aws_secretsmanager_secret_version.app_config.secret_string)

  # Define all Laravel environment variables explicitly
  environment_variables = {
    # Application Configuration
    APP_NAME                = var.eb_laravel_config.app_name
    APP_ENV                 = var.eb_laravel_config.app_env
    APP_KEY                 = local.app_config.APP_KEY  # Sensitive - from secret
    APP_DEBUG               = tostring(var.eb_laravel_config.app_debug)
    APP_URL                 = local.app_config.APP_URL  # Sensitive - from secret
    APP_LOCALE              = var.eb_laravel_config.app_locale
    APP_FALLBACK_LOCALE     = var.eb_laravel_config.app_fallback_locale
    APP_FAKER_LOCALE        = var.eb_laravel_config.app_faker_locale
    APP_MAINTENANCE_DRIVER  = var.eb_laravel_config.app_maintenance_driver
    PHP_CLI_SERVER_WORKERS  = tostring(var.eb_laravel_config.php_cli_server_workers)
    BCRYPT_ROUNDS          = tostring(var.eb_laravel_config.bcrypt_rounds)

    # Logging Configuration
    LOG_CHANNEL             = var.eb_laravel_config.log_channel
    LOG_STACK              = var.eb_laravel_config.log_stack
    LOG_DEPRECATIONS_CHANNEL = var.eb_laravel_config.log_deprecations_channel
    LOG_LEVEL              = var.eb_laravel_config.log_level

    # Database Configuration
    DB_CONNECTION          = var.eb_laravel_config.db_connection
    DB_HOST                = aws_db_instance.main.endpoint
    DB_PORT                = tostring(aws_db_instance.main.port)
    DB_DATABASE            = local.app_config.DB_DATABASE  # Sensitive - from secret
    DB_USERNAME            = local.app_config.DB_USERNAME  # Sensitive - from secret
    DB_PASSWORD            = local.app_config.DB_PASSWORD  # Sensitive - from secret

    # Session Configuration
    SESSION_DRIVER         = var.eb_laravel_config.session_driver
    SESSION_LIFETIME       = tostring(var.eb_laravel_config.session_lifetime)
    SESSION_ENCRYPT        = var.eb_laravel_config.session_encrypt ? "true" : "false"
    SESSION_PATH           = var.eb_laravel_config.session_path
    SESSION_DOMAIN         = var.eb_laravel_config.session_domain

    # Cache and Queue Configuration
    BROADCAST_CONNECTION   = var.eb_laravel_config.broadcast_connection
    FILESYSTEM_DISK        = var.eb_laravel_config.filesystem_disk
    QUEUE_CONNECTION       = var.eb_laravel_config.queue_connection
    CACHE_STORE           = var.eb_laravel_config.cache_store
    CACHE_PREFIX          = var.eb_laravel_config.cache_prefix

    # Redis Configuration
    REDIS_CLIENT          = var.eb_laravel_config.redis_client
    REDIS_HOST            = var.eb_laravel_config.redis_host
    REDIS_PASSWORD        = "null"  # Can be moved to secret if needed
    REDIS_PORT            = tostring(var.eb_laravel_config.redis_port)

    # Mail Configuration
    MAIL_MAILER           = var.eb_laravel_config.mail_mailer
    MAIL_SCHEME           = var.eb_laravel_config.mail_scheme
    MAIL_HOST             = var.eb_laravel_config.mail_host
    MAIL_PORT             = tostring(var.eb_laravel_config.mail_port)
    MAIL_USERNAME         = local.app_config.MAIL_USERNAME  # Sensitive - from secret
    MAIL_PASSWORD         = local.app_config.MAIL_PASSWORD  # Sensitive - from secret
    MAIL_FROM_ADDRESS     = var.eb_laravel_config.mail_from_address
    MAIL_FROM_NAME        = var.eb_laravel_config.mail_from_name

    # AWS Configuration (using IAM role authentication)
    AWS_DEFAULT_REGION    = var.eb_laravel_config.aws_default_region
    AWS_BUCKET            = aws_s3_bucket.main.bucket
    AWS_USE_PATH_STYLE_ENDPOINT = var.eb_laravel_config.aws_use_path_style_endpoint ? "true" : "false"

    # Vite Configuration
    VITE_APP_NAME         = var.eb_laravel_config.app_name
  }
}

