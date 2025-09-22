terraform {
  required_version = ">= 1.0"

  # # Terraform Cloud backend configuration
  # cloud {
  #   organization = "your-organization-name"  # Replace with your Terraform Cloud organization
  #
  #   workspaces {
  #     name = "rentpath-production"
  #   }
  # }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
