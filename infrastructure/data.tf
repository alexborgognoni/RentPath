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

