terraform {
  required_version = ">= 1.0"

  # S3 backend configuration
  backend "s3" {
    bucket  = "rentpath-terraform-state"
    key     = "production/terraform.tfstate"
    region  = "eu-central-1"
    encrypt = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}
