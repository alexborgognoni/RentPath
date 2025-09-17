# ==============================================================================
# SECRETS MANAGER CONFIGURATION
# ==============================================================================
#
# IMPORTANT: All secrets referenced by data sources in data.tf must be created
# manually using AWS CLI before running Terraform. This prevents circular
# dependencies between secret creation and consumption.
#
# Required secrets to create manually:
# - {project_name}-{environment}/app-config
#
# This single secret contains all environment variables and configuration.
#
# Use the AWS CLI commands in the project README to create these secrets.
#
# ==============================================================================

# Note: Database password secret is still managed by Terraform in rds.tf
# as it's auto-generated and doesn't create circular dependencies.