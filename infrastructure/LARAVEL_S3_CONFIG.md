# Laravel S3 Configuration for Two-Bucket Setup

This document explains how to configure Laravel to use the two-bucket S3 setup with CloudFront.

## Architecture Overview

We use **two separate S3 buckets** with CloudFront distributions:

1. **Private Bucket** (`rentpath-production-private-assets`): For sensitive files that require authentication
   - ID documents, license documents, private user data
   - Requires **CloudFront signed URLs** (time-limited, revocable)
   - Access controlled at infrastructure level

2. **Public Bucket** (`rentpath-production-public-assets`): For publicly accessible files
   - Property images, profile pictures, public assets
   - Standard CloudFront URLs (permanent, no signatures required)
   - Fast CDN delivery

## Environment Variables

The Terraform infrastructure automatically sets these environment variables in Elastic Beanstalk:

```bash
# AWS General Configuration
AWS_DEFAULT_REGION=eu-central-1

# Private S3 Bucket (signed URLs required)
AWS_PRIVATE_BUCKET=rentpath-production-private-assets
AWS_PRIVATE_URL=https://d1234567890.cloudfront.net
AWS_PRIVATE_CLOUDFRONT_KEY_PAIR_ID=K1234567890ABC

# Public S3 Bucket (public access)
AWS_PUBLIC_BUCKET=rentpath-production-public-assets
AWS_PUBLIC_URL=https://d0987654321.cloudfront.net
```

## Laravel Filesystem Configuration

Update `config/filesystems.php`:

```php
<?php

return [
    'default' => env('FILESYSTEM_DISK', 's3_public'),

    'disks' => [
        // ... other disks ...

        // Private S3 bucket with CloudFront signed URLs
        's3_private' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),  // Uses IAM role, so this can be empty
            'secret' => env('AWS_SECRET_ACCESS_KEY'),  // Uses IAM role, so this can be empty
            'region' => env('AWS_DEFAULT_REGION', 'eu-central-1'),
            'bucket' => env('AWS_PRIVATE_BUCKET'),
            'url' => env('AWS_PRIVATE_URL'),  // CloudFront domain for private bucket
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'visibility' => 'private',  // Always private
        ],

        // Public S3 bucket with standard CloudFront URLs
        's3_public' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),  // Uses IAM role, so this can be empty
            'secret' => env('AWS_SECRET_ACCESS_KEY'),  // Uses IAM role, so this can be empty
            'region' => env('AWS_DEFAULT_REGION', 'eu-central-1'),
            'bucket' => env('AWS_PUBLIC_BUCKET'),
            'url' => env('AWS_PUBLIC_URL'),  // CloudFront domain for public bucket
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'visibility' => 'public',  // Public by default
        ],
    ],
];
```

## Usage in Laravel Code

### Storing Files

```php
use Illuminate\Support\Facades\Storage;

// Store private files (ID documents, licenses)
Storage::disk('s3_private')->put('property-managers/id-documents/' . $filename, $file);

// Store public files (property images, profile pictures)
Storage::disk('s3_public')->put('property-listings/' . $propertyId . '/' . $filename, $file);
```

### Retrieving File URLs

```php
// For PRIVATE files: Generate signed URLs (5 minutes expiry)
$privateUrl = Storage::disk('s3_private')->temporaryUrl(
    'property-managers/id-documents/' . $filename,
    now()->addMinutes(5)
);
// Returns: https://d1234567890.cloudfront.net/path/file.pdf?Expires=...&Signature=...

// For PUBLIC files: Get permanent CloudFront URL
$publicUrl = Storage::disk('s3_public')->url('property-listings/' . $propertyId . '/' . $filename);
// Returns: https://d0987654321.cloudfront.net/property-listings/123/photo.jpg
```

### Important Notes

⚠️ **CRITICAL SECURITY CONSIDERATIONS:**

1. **Never use `Storage::disk('s3_private')->url()`** - this generates unsigned URLs that won't work
   - Private bucket requires signed URLs via `temporaryUrl()`

2. **Short expiry times for private files** - Use 1-5 minutes for sensitive documents
   ```php
   now()->addMinutes(5)  // ✅ Good - short window
   now()->addHours(1)    // ❌ Bad - too long for ID documents
   ```

3. **Choose the right disk** - Think before storing:
   - Will this file ever need to be private? → `s3_private`
   - Is this permanently public? → `s3_public`

## Installing CloudFront URL Signer Package

The private bucket requires **CloudFront signed URLs**. Install this package:

```bash
composer require aws/aws-php-sns-message-validator
composer require league/flysystem-aws-s3-v3
```

For generating CloudFront signed URLs, you'll need to implement a custom solution or use a package like `dreamonkey/laravel-cloudfront-url`.

### Custom CloudFront Signed URL Helper

Create `app/Helpers/CloudFrontUrlSigner.php`:

```php
<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class CloudFrontUrlSigner
{
    protected string $cloudFrontDomain;
    protected string $keyPairId;
    protected string $privateKey;

    public function __construct()
    {
        $this->cloudFrontDomain = config('filesystems.disks.s3_private.url');
        $this->keyPairId = env('AWS_PRIVATE_CLOUDFRONT_KEY_PAIR_ID');

        // Fetch private key from Secrets Manager once and cache it
        $this->privateKey = Cache::remember('cloudfront_private_key', 3600, function () {
            return $this->fetchPrivateKeyFromSecretsManager();
        });
    }

    protected function fetchPrivateKeyFromSecretsManager(): string
    {
        $client = new \Aws\SecretsManager\SecretsManagerClient([
            'version' => 'latest',
            'region' => env('AWS_DEFAULT_REGION', 'eu-central-1'),
        ]);

        try {
            $result = $client->getSecretValue([
                'SecretId' => env('APP_ENV') . '/cloudfront-private-key',
            ]);

            $secret = json_decode($result['SecretString'], true);
            return $secret['private_key'];
        } catch (\Exception $e) {
            \Log::error('Failed to fetch CloudFront private key: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getSignedUrl(string $path, int $expiresInMinutes = 5): string
    {
        $url = rtrim($this->cloudFrontDomain, '/') . '/' . ltrim($path, '/');
        $expires = time() + ($expiresInMinutes * 60);

        $cloudFrontClient = new \Aws\CloudFront\CloudFrontClient([
            'version' => 'latest',
            'region' => env('AWS_DEFAULT_REGION', 'eu-central-1'),
        ]);

        return $cloudFrontClient->getSignedUrl([
            'url' => $url,
            'expires' => $expires,
            'private_key' => $this->privateKey,
            'key_pair_id' => $this->keyPairId,
        ]);
    }
}
```

### Usage with Custom Helper

```php
use App\Helpers\CloudFrontUrlSigner;

// Generate signed URL for private file
$signer = new CloudFrontUrlSigner();
$signedUrl = $signer->getSignedUrl(
    'property-managers/id-documents/' . $filename,
    5  // expires in 5 minutes
);
```

## Example: Property Manager Controller

```php
<?php

namespace App\Http\Controllers;

use App\Models\PropertyManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Helpers\CloudFrontUrlSigner;

class PropertyManagerController extends Controller
{
    protected CloudFrontUrlSigner $cloudFrontSigner;

    public function __construct(CloudFrontUrlSigner $cloudFrontSigner)
    {
        $this->cloudFrontSigner = $cloudFrontSigner;
    }

    // Upload ID document (private)
    public function uploadIdDocument(Request $request, PropertyManager $propertyManager)
    {
        $request->validate([
            'id_document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',  // 5MB
        ]);

        $path = Storage::disk('s3_private')->putFile(
            'property-managers/id-documents',
            $request->file('id_document')
        );

        $propertyManager->update(['id_document_path' => $path]);

        return response()->json(['message' => 'ID document uploaded successfully']);
    }

    // View ID document (generates signed URL)
    public function viewIdDocument(PropertyManager $propertyManager)
    {
        $this->authorize('viewIdDocument', $propertyManager);

        if (!$propertyManager->id_document_path) {
            abort(404, 'ID document not found');
        }

        // Generate 5-minute signed URL
        $signedUrl = $this->cloudFrontSigner->getSignedUrl(
            $propertyManager->id_document_path,
            5
        );

        return response()->json(['url' => $signedUrl]);
    }

    // Upload profile picture (public)
    public function uploadProfilePicture(Request $request, PropertyManager $propertyManager)
    {
        $request->validate([
            'profile_picture' => 'required|image|max:2048',  // 2MB
        ]);

        // Delete old profile picture if exists
        if ($propertyManager->profile_picture_path) {
            Storage::disk('s3_public')->delete($propertyManager->profile_picture_path);
        }

        $path = Storage::disk('s3_public')->putFile(
            'property-managers/profile-pictures',
            $request->file('profile_picture')
        );

        $propertyManager->update(['profile_picture_path' => $path]);

        // Get permanent public URL
        $publicUrl = Storage::disk('s3_public')->url($path);

        return response()->json([
            'message' => 'Profile picture uploaded successfully',
            'url' => $publicUrl,
        ]);
    }
}
```

## File Organization Guidelines

### Private Bucket Structure
```
rentpath-production-private-assets/
├── property-managers/
│   ├── id-documents/
│   │   └── {hashed-filename}.pdf
│   └── license-documents/
│       └── {hashed-filename}.pdf
└── users/
    └── sensitive-data/
```

### Public Bucket Structure
```
rentpath-production-public-assets/
├── property-listings/
│   └── {property-id}/
│       ├── photo-1.jpg
│       ├── photo-2.jpg
│       └── thumbnail.jpg
├── property-managers/
│   └── profile-pictures/
│       └── {manager-id}.jpg
└── static-assets/
    └── branding/
```

## Testing

```php
// Test private file with signed URL
$path = Storage::disk('s3_private')->put('test.txt', 'Private content');
$signedUrl = $cloudFrontSigner->getSignedUrl($path, 1);
// Visit URL within 1 minute - should work
// Wait 2 minutes and try again - should fail

// Test public file
$path = Storage::disk('s3_public')->put('test.jpg', $imageContent);
$publicUrl = Storage::disk('s3_public')->url($path);
// Visit URL anytime - should always work
```

## Security Best Practices

1. ✅ **Always use `s3_private` for sensitive data**
2. ✅ **Use short expiry times** (1-5 minutes for ID documents)
3. ✅ **Validate file types and sizes** before upload
4. ✅ **Use authorization policies** before generating URLs
5. ✅ **Log access** to private files for audit trails
6. ❌ **Never expose signed URLs in JavaScript** - generate server-side only
7. ❌ **Never commit private keys to version control**

## Troubleshooting

### "Access Denied" errors
- Check IAM role has access to both buckets
- Verify CloudFront distribution is deployed
- Check bucket policies allow CloudFront OAC

### Signed URLs not working
- Verify `AWS_PRIVATE_CLOUDFRONT_KEY_PAIR_ID` is set
- Check private key is correctly fetched from Secrets Manager
- Ensure clock is synchronized (signed URLs are time-sensitive)

### Files not appearing in CloudFront
- CloudFront caching can cause delays (up to 24 hours default)
- Invalidate CloudFront cache if needed: `aws cloudfront create-invalidation`

## CloudFront Cache Invalidation

When you need to update files immediately:

```bash
# Invalidate specific file
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/property-listings/123/*"

# Invalidate all files (expensive)
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

## Cost Optimization

- **Private bucket**: Short TTL (5-15 mins) - less caching, more secure
- **Public bucket**: Long TTL (24 hours - 1 year) - more caching, cheaper
- Use CloudFront compression for images
- Consider using WebP format for images

## Additional Resources

- [AWS CloudFront Signed URLs Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html)
- [Laravel Storage Documentation](https://laravel.com/docs/filesystem)
- [AWS S3 Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html)
