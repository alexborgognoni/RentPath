<?php

namespace App\Helpers;

use Aws\CloudFront\CloudFrontClient;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class StorageHelper
{
    /**
     * Get the appropriate disk based on visibility and configuration.
     *
     * Uses environment variables FILESYSTEM_DISK_PUBLIC and FILESYSTEM_DISK_PRIVATE
     * to determine which disk to use.
     *
     * @param string $visibility 'public' or 'private'
     * @return string The disk name
     */
    public static function getDisk(string $visibility): string
    {
        if (!in_array($visibility, ['public', 'private'])) {
            throw new \InvalidArgumentException("Invalid visibility: {$visibility}. Must be 'public' or 'private'.");
        }

        // Default to S3 disks in production, local disks in local environment
        $defaultPublic = app()->environment('local') ? 'public' : 's3_public';
        $defaultPrivate = app()->environment('local') ? 'private' : 's3_private';

        return match($visibility) {
            'public' => env('FILESYSTEM_DISK_PUBLIC', $defaultPublic),
            'private' => env('FILESYSTEM_DISK_PRIVATE', $defaultPrivate),
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
        $diskConfig = config("filesystems.disks.{$disk}");

        // For S3 buckets, always use 'private' visibility to avoid ACL issues
        // We use CloudFront for public access, not S3 ACLs
        if ($diskConfig['driver'] === 's3') {
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
            // Production: CloudFront signed URLs
            if (env('AWS_PRIVATE_CLOUDFRONT_KEY_PAIR_ID')) {
                return self::getCloudFrontSignedUrl($path, $expiresInMinutes);
            }

            // Local: Laravel signed URLs (mimics CloudFront behavior)
            // Use appropriate route based on current subdomain
            $currentHost = request()->getHost();
            $managerHost = env('MANAGER_SUBDOMAIN', 'manager') . '.' . config('app.domain');

            $routeName = ($currentHost === $managerHost)
                ? 'private.storage'
                : 'tenant.private.storage';

            // Force URL generation to use current request scheme/host/port
            $url = \Illuminate\Support\Facades\URL::temporarySignedRoute(
                $routeName,
                now()->addMinutes($expiresInMinutes),
                ['path' => $path]
            );

            // Replace the base URL with the current request URL to ensure subdomain is correct
            $currentUrl = request()->getSchemeAndHttpHost();
            $appUrl = config('app.url');

            return str_replace($appUrl, $currentUrl, $url);
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
