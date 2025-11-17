# Route53 Hosted Zone
resource "aws_route53_zone" "main" {
  name    = var.domain_name
  comment = "Website for rentpath"

  tags = {
    Name        = "${var.project_name}-${var.environment}-hosted-zone"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# ACM Certificate for the domain (eu-central-1 for Elastic Beanstalk)
resource "aws_acm_certificate" "domain_cert" {
  domain_name               = var.domain_name
  subject_alternative_names = ["*.${var.domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-certificate"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# ACM Certificate for CloudFront (MUST be in us-east-1)
resource "aws_acm_certificate" "cloudfront_cert" {
  provider                  = aws.us_east_1
  domain_name               = var.domain_name
  subject_alternative_names = ["*.${var.domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-cloudfront-certificate"
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
#
# Certificate validation records (automatically created)
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.domain_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 300
  type            = each.value.type
  zone_id         = aws_route53_zone.main.zone_id
}

# Certificate validation completion
resource "aws_acm_certificate_validation" "domain_cert" {
  certificate_arn         = aws_acm_certificate.domain_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# CloudFront certificate validation (uses same DNS records)
resource "aws_acm_certificate_validation" "cloudfront_cert" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.cloudfront_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# A record for root domain pointing to Elastic Beanstalk
resource "aws_route53_record" "root_domain" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_elastic_beanstalk_environment.main.cname
    zone_id                = data.aws_elastic_beanstalk_hosted_zone.current.id
    evaluate_target_health = true
  }
}
#
# A record for www subdomain pointing to Elastic Beanstalk
resource "aws_route53_record" "www_domain" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_elastic_beanstalk_environment.main.cname
    zone_id                = data.aws_elastic_beanstalk_hosted_zone.current.id
    evaluate_target_health = true
  }
}

# A record for manager subdomain pointing to Elastic Beanstalk
resource "aws_route53_record" "manager_domain" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "manager.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_elastic_beanstalk_environment.main.cname
    zone_id                = data.aws_elastic_beanstalk_hosted_zone.current.id
    evaluate_target_health = true
  }
}
#
# MX record for email
resource "aws_route53_record" "mx_record" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "MX"
  ttl     = 300
  records = [var.mx_record_value]
}

# DKIM CNAME records for Microsoft 365 email authentication
resource "aws_route53_record" "dkim_selector1" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "selector1._domainkey.${var.domain_name}"
  type    = "CNAME"
  ttl     = 300
  records = [var.dkim_selector1_cname]
}

resource "aws_route53_record" "dkim_selector2" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "selector2._domainkey.${var.domain_name}"
  type    = "CNAME"
  ttl     = 300
  records = [var.dkim_selector2_cname]
}

# SPF TXT record for email authentication
resource "aws_route53_record" "spf" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "TXT"
  ttl     = 300
  records = [var.spf_record]
}

# Autodiscover CNAME for Microsoft 365 email client configuration
resource "aws_route53_record" "autodiscover" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "autodiscover.${var.domain_name}"
  type    = "CNAME"
  ttl     = 300
  records = [var.autodiscover_cname]
}

# DMARC TXT record for email authentication policy
resource "aws_route53_record" "dmarc" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "_dmarc.${var.domain_name}"
  type    = "TXT"
  ttl     = 300
  records = ["v=DMARC1; p=none; rua=mailto:${var.dmarc_reporting_email}; pct=100"]
}

# CloudFront CDN subdomains
resource "aws_route53_record" "cdn_public" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "cdn.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.public.domain_name
    zone_id                = aws_cloudfront_distribution.public.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "cdn_private" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "assets.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.private.domain_name
    zone_id                = aws_cloudfront_distribution.private.hosted_zone_id
    evaluate_target_health = false
  }
}

