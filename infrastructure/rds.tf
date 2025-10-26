# RDS Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-db-subnet-group"
  })
}

# Note: Database password is now managed via the app-config secret

# RDS Parameter Group
resource "aws_db_parameter_group" "main" {
  family = "mysql8.0"
  name   = "${var.project_name}-${var.environment}-db-params"

  parameter {
    name         = "innodb_buffer_pool_size"
    value        = "{DBInstanceClassMemory*3/4}"
    apply_method = "pending-reboot"
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-db-params"
  })
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-${var.environment}"

  # Engine configuration
  engine         = var.rds_engine
  engine_version = var.rds_engine_version
  instance_class = var.rds_instance_class

  # Storage configuration
  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type          = "gp2"
  storage_encrypted     = true

  # Database configuration (using app-config secret)
  db_name  = local.app_config.DB_DATABASE
  username = local.app_config.DB_USERNAME
  password = local.app_config.DB_PASSWORD
  port     = 3306

  # Network configuration
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false

  # Backup configuration
  backup_retention_period = var.rds_backup_retention_period
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"

  # Performance and monitoring
  parameter_group_name = aws_db_parameter_group.main.name
  monitoring_interval  = 0

  # High availability
  multi_az = var.rds_multi_az

  # Deletion protection
  deletion_protection = var.rds_deletion_protection
  skip_final_snapshot = !var.rds_deletion_protection

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-database"
  })
}

# Note: Database credentials are now managed via the app-config secret

