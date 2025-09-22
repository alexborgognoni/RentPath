# Elastic Beanstalk application
resource "aws_elastic_beanstalk_application" "main" {
  name        = var.project_name
  description = "Laravel application for ${var.project_name}"

  appversion_lifecycle {
    service_role          = aws_iam_role.eb_service_role.arn
    max_count             = 128
    delete_source_from_s3 = true
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-application"
  })
}

# Elastic Beanstalk environment
resource "aws_elastic_beanstalk_environment" "main" {
  name                = "${var.project_name}-${var.environment}"
  application         = aws_elastic_beanstalk_application.main.name
  solution_stack_name = var.eb_solution_stack

  # General settings
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "LoadBalanced"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = aws_iam_role.eb_service_role.arn
  }

  # Auto Scaling configuration
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = var.eb_instance_type
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.eb_ec2_profile.name
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = tostring(var.eb_min_size)
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = tostring(var.eb_max_size)
  }

  # PHP configuration
  setting {
    namespace = "aws:elasticbeanstalk:container:php:phpini"
    name      = "document_root"
    value     = "/public"
  }

  setting {
    namespace = "aws:elasticbeanstalk:container:php:phpini"
    name      = "memory_limit"
    value     = "512M"
  }

  setting {
    namespace = "aws:elasticbeanstalk:container:php:phpini"
    name      = "allow_url_fopen"
    value     = "On"
  }

  setting {
    namespace = "aws:elasticbeanstalk:container:php:phpini"
    name      = "display_errors"
    value     = "Off"
  }

  setting {
    namespace = "aws:elasticbeanstalk:container:php:phpini"
    name      = "max_execution_time"
    value     = "120"
  }

  setting {
    namespace = "aws:elasticbeanstalk:container:php:phpini"
    name      = "zlib.output_compression"
    value     = "Off"
  }

  # Node.js configuration for React builds
  setting {
    namespace = "aws:elasticbeanstalk:container:nodejs"
    name      = "NodeVersion"
    value     = "20"
  }

  setting {
    namespace = "aws:elasticbeanstalk:container:nodejs"
    name      = "NodeCommand"
    value     = "npm start"
  }

  # Proxy configuration
  setting {
    namespace = "aws:elasticbeanstalk:environment:proxy"
    name      = "ProxyServer"
    value     = "nginx"
  }

  # Health monitoring
  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "enhanced"
  }

  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "EnhancedHealthAuthEnabled"
    value     = "true"
  }

  # Health check endpoint for Laravel/Inertia applications
  setting {
    namespace = "aws:elasticbeanstalk:application"
    name      = "Application Healthcheck URL"
    value     = "/up"
  }

  # Deployment configuration
  setting {
    namespace = "aws:elasticbeanstalk:command"
    name      = "DeploymentPolicy"
    value     = "AllAtOnce"
  }

  setting {
    namespace = "aws:elasticbeanstalk:command"
    name      = "Timeout"
    value     = "600"
  }

  # Application environment variables from consolidated app-config secret
  dynamic "setting" {
    for_each = local.environment_variables
    content {
      namespace = "aws:elasticbeanstalk:application:environment"
      name      = setting.key
      value     = setting.value
    }
  }

  # Network configuration
  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = var.vpc_id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", var.private_subnet_ids)
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBSubnets"
    value     = join(",", var.public_subnet_ids)
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.eb_ec2.id
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}"
  })
}
