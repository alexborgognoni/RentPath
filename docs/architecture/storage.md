# Storage Architecture

## StorageHelper Pattern

The `StorageHelper` class (`app/Helpers/StorageHelper.php`) provides environment-aware URL generation for files.

### Local Development

| Visibility | Disk | URL Type |
|------------|------|----------|
| Public | `public` | Direct URLs |
| Private | `private` | Laravel signed routes |

### Production

| Visibility | Disk | URL Type |
|------------|------|----------|
| Public | `s3_public` | CloudFront URLs |
| Private | `s3_private` | CloudFront signed URLs (24h expiry) |

CloudFront private key is fetched from AWS Secrets Manager and cached for 1 hour.

## File Types

| Type | Visibility | Max Size | Formats |
|------|------------|----------|---------|
| Profile pictures | Public | 5MB | JPEG, PNG, WEBP |
| ID documents | Private | 20MB | PDF, JPEG, PNG |
| License documents | Private | 20MB | PDF, JPEG, PNG |
| Property images | Private | 10MB | JPEG, PNG, WEBP |
| Income proof | Private | 20MB | PDF, JPEG, PNG |
| Reference letters | Private | 20MB | PDF |
| Lease documents | Private | 20MB | PDF |

## Document Access

- **Property CRUD**: Only owner can edit/delete
- **Application access**: Only tenant who created + PM of property
- **Documents**: CloudFront signed URLs or Laravel signed routes
- **Token validation**: Check expiry, status, email match (if invite type)
