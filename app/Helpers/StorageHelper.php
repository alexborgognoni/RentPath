<?php

namespace App\Helpers;

use Aws\CloudFront\CloudFrontClient;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class StorageHelper
{
    /**
     * Get the appropriate disk based on visibility and environment.
     *
     * In local environment, uses Laravel's local 'public' and 'private' disks.
     * In production/staging, uses S3 buckets via 's3_public' and 's3_private'.
     *
     * @param string $visibility 'public' or 'private'
     * @return string The disk name
     */
    public static function getDisk(string $visibility): string
    {
        if (!in_array($visibility, ['public', 'private'])) {
            throw new \InvalidArgumentException("Invalid visibility: {$visibility}. Must be 'public' or 'private'.");
        }

        // In local environment, use local disks
        if (app()->environment('local')) {
            return $visibility; // 'public' or 'private' local disks
        }

        // In production/staging, use S3 buckets
        return match($visibility) {
            'public' => 's3_public',
            'private' => 's3_private',
        };
    }

    /**
     * Store a file with the specified visibility.
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $path
     * @param string $visibility 'public' or 'private'
     * @return string The stored file path
     */
    public static function store($file, string $path, string $visibility): string
    {
        $disk = self::getDisk($visibility);

        // For S3 buckets, always use 'private' visibility to avoid ACL issues
        // We use CloudFront for public access, not S3 ACLs
        if (in_array($disk, ['s3_public', 's3_private'])) {
            return $file->store($path, ['disk' => $disk, 'visibility' => 'private']);
        }

        // For local disks, use the specified visibility
        return $file->store($path, $disk);
    }

    /**
     * Get a URL for a stored file based on its visibility.
     *
     * @param string $path
     * @param string $visibility 'public' or 'private'
     * @param int $expiresInMinutes Only used for private files
     * @return string|null
     */
    public static function url(?string $path, string $visibility, int $expiresInMinutes = 5): ?string
    {
        if (!$path) {
            return null;
        }

        $disk = self::getDisk($visibility);

        // For private files, generate signed URLs
        if ($visibility === 'private') {
            // In local environment, return regular URL
            if (app()->environment('local')) {
                return Storage::disk($disk)->url($path);
            }

            // Production: CloudFront signed URL
            return self::getCloudFrontSignedUrl($path, $expiresInMinutes);
        }

        // For public files, just return the URL
        return Storage::disk($disk)->url($path);
    }

    /**
     * Generate a CloudFront signed URL for private content.
     *
     * @param string $path
     * @param int $expiresInMinutes
     * @return string
     */
    protected static function getCloudFrontSignedUrl(string $path, int $expiresInMinutes): string
    {
        $cloudFrontUrl = config('filesystems.disks.s3_private.url');
        $keyPairId = env('AWS_PRIVATE_CLOUDFRONT_KEY_PAIR_ID');

        if (!$cloudFrontUrl || !$keyPairId) {
            throw new \RuntimeException('CloudFront URL or Key Pair ID not configured');
        }

        // Get the private key from Secrets Manager (cached for 1 hour)
        $privateKey = Cache::remember('cloudfront_private_key', 3600, function () {
            $secretsClient = new \Aws\SecretsManager\SecretsManagerClient([
                'region' => config('filesystems.disks.s3_private.region'),
                'version' => 'latest',
            ]);

            try {
                $result = $secretsClient->getSecretValue([
                    'SecretId' => env('AWS_PRIVATE_CLOUDFRONT_SECRET_NAME', 'rentpath-production-cloudfront-private-key'),
                ]);

                $secret = json_decode($result['SecretString'], true);
                return $secret['private_key'];
            } catch (\Exception $e) {
                throw new \RuntimeException('Failed to retrieve CloudFront private key: ' . $e->getMessage());
            }
        });

        // Create CloudFront client
        $cloudFront = new CloudFrontClient([
            'region' => config('filesystems.disks.s3_private.region'),
            'version' => '2020-05-31',
        ]);

        // Generate signed URL
        $resourceKey = rtrim($cloudFrontUrl, '/') . '/' . ltrim($path, '/');
        $expires = time() + ($expiresInMinutes * 60);

        return $cloudFront->getSignedUrl([
            'url' => $resourceKey,
            'expires' => $expires,
            'private_key' => $privateKey,
            'key_pair_id' => $keyPairId,
        ]);
    }
}
