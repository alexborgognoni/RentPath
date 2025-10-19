# Local Development Setup

## Storage Configuration

The application automatically adapts storage based on environment:

### Local Environment (`APP_ENV=local`)
- **Public files** → `storage/app/public/` (symlinked to `public/storage`)
- **Private files** → `storage/app/private/`
- No S3 or CloudFront required for development

### Production/Staging Environment
- **Public files** → S3 public bucket via CloudFront
- **Private files** → S3 private bucket via CloudFront signed URLs

## How It Works

### StorageHelper Automatically Detects Environment

```php
// Your code stays the same regardless of environment:
StorageHelper::store($file, 'property-managers/profile-pictures', 'public');
StorageHelper::store($file, 'property-managers/id-documents', 'private');

// Local: Uses storage/app/public/ and storage/app/private/
// Production: Uses s3_public and s3_private buckets
```

## Local Development Setup Steps

### 1. Create Storage Link

```bash
php artisan storage:link
```

This creates a symlink from `public/storage` → `storage/app/public`.

### 2. Ensure .env is Configured

```env
APP_ENV=local
APP_URL=http://localhost:8000

# S3 variables are NOT needed for local development
# (Optional) If you want to test with real S3 locally:
# AWS_PRIVATE_BUCKET=your-dev-private-bucket
# AWS_PUBLIC_BUCKET=your-dev-public-bucket
# AWS_PRIVATE_URL=your-cloudfront-url
# AWS_PUBLIC_URL=your-cloudfront-url
```

### 3. File Storage Locations

When you upload files locally:

**Profile Pictures** (public):
```
storage/app/public/property-managers/profile-pictures/xyz.jpg
↓ Accessible via:
http://localhost:8000/storage/property-managers/profile-pictures/xyz.jpg
```

**ID Documents** (private):
```
storage/app/private/property-managers/id-documents/xyz.pdf
↓ Accessible via:
PropertyManagerController@serveDocument route
(Not directly accessible via URL)
```

## Accessing Private Files Locally

In production, private files use CloudFront signed URLs. Locally, they're served via a controller route:

```php
// In routes/web.php (if not already exists):
Route::get('/documents/{type}', [PropertyManagerController::class, 'serveDocument'])
    ->middleware('auth')
    ->name('documents.serve');
```

The `serveDocument` method generates URLs based on environment:
- **Local**: Returns path to `storage/app/private/...`
- **Production**: Returns CloudFront signed URL (5-minute expiry)

## File Permissions

Make sure storage directories are writable:

```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

## Testing Upload/Download

### Upload a Profile Picture (Public)
```bash
# Via frontend or API
POST /setup-profile
Content-Type: multipart/form-data

profile_picture: [file]

# File stored at: storage/app/public/property-managers/profile-pictures/
# Accessible at: http://localhost:8000/storage/property-managers/profile-pictures/...
```

### Upload an ID Document (Private)
```bash
# Via frontend or API
POST /setup-profile
Content-Type: multipart/form-data

id_document: [file]

# File stored at: storage/app/private/property-managers/id-documents/
# Accessible via: /documents/id_document (authentication required)
```

## Common Issues

### Issue: "Class 'App\Helpers\StorageHelper' not found"

**Solution**: Run `composer dump-autoload`

### Issue: "Symlink already exists"

**Solution**:
```bash
rm public/storage
php artisan storage:link
```

### Issue: "The file does not exist" when accessing uploads

**Solution**: Check that storage link exists:
```bash
ls -la public/storage  # Should show symlink to ../storage/app/public
```

### Issue: Profile pictures not showing

**Solutions**:
1. Check storage link exists: `php artisan storage:link`
2. Check file permissions: `chmod -R 775 storage`
3. Check .env: `APP_URL=http://localhost:8000` (no trailing slash)

## Switching Between Local and Production

The `StorageHelper` automatically handles this. You don't need to change any code:

```php
// This code works in BOTH local and production:
$path = StorageHelper::store($file, 'path/', 'public');
$url = StorageHelper::url($path, 'public');
```

**Local Result**:
- Path: `property-managers/profile-pictures/abc123.jpg`
- URL: `http://localhost:8000/storage/property-managers/profile-pictures/abc123.jpg`
- Disk: `public` (local filesystem)

**Production Result**:
- Path: `property-managers/profile-pictures/abc123.jpg`
- URL: `https://d1234567890.cloudfront.net/property-managers/profile-pictures/abc123.jpg`
- Disk: `s3_public` (S3 + CloudFront)

## Optional: Local S3 Testing with MinIO

If you want to test S3 functionality locally without AWS costs, use MinIO:

### 1. Start MinIO with Docker

```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"
```

### 2. Configure .env

```env
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_DEFAULT_REGION=us-east-1
AWS_ENDPOINT=http://localhost:9000
AWS_USE_PATH_STYLE_ENDPOINT=true

AWS_PRIVATE_BUCKET=rentpath-local-private-assets
AWS_PUBLIC_BUCKET=rentpath-local-public-assets
AWS_PRIVATE_URL=http://localhost:9000/rentpath-local-private-assets
AWS_PUBLIC_URL=http://localhost:9000/rentpath-local-public-assets
```

### 3. Create Buckets via MinIO Console

Visit http://localhost:9001 and create:
- `rentpath-local-private-assets`
- `rentpath-local-public-assets`

Now your local environment will behave like production (using S3), but all storage is local!

## Deployment Checklist

Before deploying to production:

- [ ] Ensure Terraform has created S3 buckets
- [ ] Verify CloudFront distributions are deployed
- [ ] Check that environment variables are set in Elastic Beanstalk:
  - `AWS_PRIVATE_BUCKET`
  - `AWS_PUBLIC_BUCKET`
  - `AWS_PRIVATE_URL`
  - `AWS_PUBLIC_URL`
  - `AWS_PRIVATE_CLOUDFRONT_KEY_PAIR_ID`
- [ ] Test file upload in staging environment
- [ ] Verify profile pictures are publicly accessible
- [ ] Verify ID documents require signed URLs

## Summary

✅ **No configuration needed** - Just run `php artisan storage:link` and develop normally
✅ **Automatic environment detection** - StorageHelper handles local vs production
✅ **Same code everywhere** - No environment-specific conditionals in your controllers
✅ **Local files in `storage/`** - No AWS costs during development
✅ **Production files in S3** - With CloudFront CDN and proper security
