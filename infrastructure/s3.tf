# ============================================================================
# CLOUDFRONT KEY PAIR FOR PRIVATE BUCKET SIGNED URLs
# ============================================================================

# Generate RSA private key for CloudFront signed URLs
resource "tls_private_key" "cloudfront_private_key" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

# Create CloudFront public key
resource "aws_cloudfront_public_key" "private_bucket_key" {
  comment     = "Public key for ${var.project_name} ${var.environment} private assets signed URLs"
  encoded_key = tls_private_key.cloudfront_private_key.public_key_pem
  name        = "${var.project_name}-${var.environment}-private-key"
}

# Create CloudFront key group
resource "aws_cloudfront_key_group" "private_bucket_key_group" {
  name    = "${var.project_name}-${var.environment}-private-key-group"
  comment = "Key group for private assets signed URLs"
  items   = [aws_cloudfront_public_key.private_bucket_key.id]
}

# Store CloudFront private key in Secrets Manager
resource "aws_secretsmanager_secret" "cloudfront_private_key" {
  name        = "${local.name_prefix}/cloudfront-private-key"
  description = "CloudFront private key for signing URLs to private assets bucket"

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "cloudfront_private_key" {
  secret_id = aws_secretsmanager_secret.cloudfront_private_key.id
  secret_string = jsonencode({
    private_key    = tls_private_key.cloudfront_private_key.private_key_pem
    public_key_id  = aws_cloudfront_public_key.private_bucket_key.id
    key_group_id   = aws_cloudfront_key_group.private_bucket_key_group.id
  })
}

# ============================================================================
# PRIVATE ASSETS BUCKET (existing bucket, keep files in place)
# ============================================================================

# S3 bucket for private assets (signed URLs via CloudFront)
resource "aws_s3_bucket" "private" {
  bucket = "${var.project_name}-${var.environment}-private-assets"

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-private-assets"
  })
}

# Private bucket versioning
resource "aws_s3_bucket_versioning" "private" {
  bucket = aws_s3_bucket.private.id
  versioning_configuration {
    status = var.s3_versioning_enabled ? "Enabled" : "Disabled"
  }
}

# Private bucket encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "private" {
  bucket = aws_s3_bucket.private.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# Private bucket public access block
resource "aws_s3_bucket_public_access_block" "private" {
  bucket = aws_s3_bucket.private.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Private bucket lifecycle configuration
resource "aws_s3_bucket_lifecycle_configuration" "private" {
  bucket = aws_s3_bucket.private.id

  rule {
    id     = "cleanup_incomplete_uploads"
    status = "Enabled"

    filter {}

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }

  rule {
    id     = "transition_to_ia"
    status = "Enabled"

    filter {}

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    transition {
      days          = 180
      storage_class = "DEEP_ARCHIVE"
    }
  }

  dynamic "rule" {
    for_each = var.s3_versioning_enabled ? [1] : []
    content {
      id     = "cleanup_old_versions"
      status = "Enabled"

      filter {}

      noncurrent_version_transition {
        noncurrent_days = 30
        storage_class   = "STANDARD_IA"
      }

      noncurrent_version_transition {
        noncurrent_days = 90
        storage_class   = "GLACIER"
      }

      noncurrent_version_expiration {
        noncurrent_days = 365
      }
    }
  }
}

# CloudFront Origin Access Control for private bucket
resource "aws_cloudfront_origin_access_control" "private" {
  name                              = "${var.project_name}-${var.environment}-private-oac"
  description                       = "OAC for ${var.project_name} ${var.environment} private assets"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront distribution for private bucket (requires signed URLs)
resource "aws_cloudfront_distribution" "private" {
  origin {
    domain_name              = aws_s3_bucket.private.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.private.id
    origin_id                = "S3-${aws_s3_bucket.private.bucket}"
  }

  enabled = true
  comment = "Private CDN for ${var.project_name} ${var.environment} (requires signed URLs)"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.private.bucket}"

    # Require signed URLs
    trusted_key_groups = [aws_cloudfront_key_group.private_bucket_key_group.id]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 300   # 5 minutes - short cache for private content
    max_ttl                = 900   # 15 minutes
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-private-cdn"
  })
}

# S3 bucket policy for private bucket (CloudFront OAC + Backend IAM Role)
resource "aws_s3_bucket_policy" "private" {
  bucket = aws_s3_bucket.private.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.private.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.private.arn
          }
        }
      },
      {
        Sid    = "AllowBackendIAMRole"
        Effect = "Allow"
        Principal = {
          AWS = aws_iam_role.eb_ec2_role.arn
        }
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "${aws_s3_bucket.private.arn}/*",
          aws_s3_bucket.private.arn
        ]
      }
    ]
  })
}

# ============================================================================
# PUBLIC ASSETS BUCKET (new bucket for public files)
# ============================================================================

# S3 bucket for public assets (accessible via CloudFront to everyone)
resource "aws_s3_bucket" "public" {
  bucket = "${var.project_name}-${var.environment}-public-assets"

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-public-assets"
  })
}

# Public bucket versioning
resource "aws_s3_bucket_versioning" "public" {
  bucket = aws_s3_bucket.public.id
  versioning_configuration {
    status = var.s3_versioning_enabled ? "Enabled" : "Disabled"
  }
}

# Public bucket encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "public" {
  bucket = aws_s3_bucket.public.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# Public bucket public access block
resource "aws_s3_bucket_public_access_block" "public" {
  bucket = aws_s3_bucket.public.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Public bucket lifecycle configuration
resource "aws_s3_bucket_lifecycle_configuration" "public" {
  bucket = aws_s3_bucket.public.id

  rule {
    id     = "cleanup_incomplete_uploads"
    status = "Enabled"

    filter {}

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }

  rule {
    id     = "transition_to_ia"
    status = "Enabled"

    filter {}

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 180
      storage_class = "GLACIER"
    }
  }

  dynamic "rule" {
    for_each = var.s3_versioning_enabled ? [1] : []
    content {
      id     = "cleanup_old_versions"
      status = "Enabled"

      filter {}

      noncurrent_version_transition {
        noncurrent_days = 90
        storage_class   = "STANDARD_IA"
      }

      noncurrent_version_expiration {
        noncurrent_days = 365
      }
    }
  }
}

# CloudFront Origin Access Control for public bucket
resource "aws_cloudfront_origin_access_control" "public" {
  name                              = "${var.project_name}-${var.environment}-public-oac"
  description                       = "OAC for ${var.project_name} ${var.environment} public assets"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront distribution for public bucket (no signed URLs required)
resource "aws_cloudfront_distribution" "public" {
  origin {
    domain_name              = aws_s3_bucket.public.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.public.id
    origin_id                = "S3-${aws_s3_bucket.public.bucket}"
  }

  enabled = true
  comment = "Public CDN for ${var.project_name} ${var.environment}"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.public.bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400  # 24 hours - longer cache for public content
    max_ttl                = 31536000  # 1 year
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-public-cdn"
  })
}

# S3 bucket policy for public bucket (CloudFront OAC + Backend IAM role)
resource "aws_s3_bucket_policy" "public" {
  bucket = aws_s3_bucket.public.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.public.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.public.arn
          }
        }
      },
      {
        Sid    = "AllowBackendIAMRole"
        Effect = "Allow"
        Principal = {
          AWS = aws_iam_role.eb_ec2_role.arn
        }
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "${aws_s3_bucket.public.arn}/*",
          aws_s3_bucket.public.arn
        ]
      }
    ]
  })
}

# ============================================================================
# BACKUP BUCKET (optional)
# ============================================================================

# S3 bucket for backups (optional)
resource "aws_s3_bucket" "backups" {
  count  = var.s3_create_backup_bucket ? 1 : 0
  bucket = "${var.project_name}-${var.environment}-backups"

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-backups"
  })
}

# Backup bucket encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "backups" {
  count  = var.s3_create_backup_bucket ? 1 : 0
  bucket = aws_s3_bucket.backups[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# Backup bucket public access block
resource "aws_s3_bucket_public_access_block" "backups" {
  count  = var.s3_create_backup_bucket ? 1 : 0
  bucket = aws_s3_bucket.backups[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
