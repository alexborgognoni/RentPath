<?php

namespace App\Helpers;

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
        return $file->store($path, $disk);
    }

    /**
     * Get a URL for a stored file based on its visibility.
     *
     * In local environment, private files use Laravel's temporaryUrl (which may not work with local disk).
     * Consider using a route-based approach for local development.
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
            // In local environment, local disk doesn't support temporaryUrl
            // Return regular URL (for local dev only - production uses CloudFront signed URLs)
            if (app()->environment('local')) {
                return \Illuminate\Support\Facades\Storage::disk($disk)->url($path);
            }

            // Production: CloudFront signed URL
            return \Illuminate\Support\Facades\Storage::disk($disk)->temporaryUrl(
                $path,
                now()->addMinutes($expiresInMinutes)
            );
        }

        // For public files, just return the URL
        return \Illuminate\Support\Facades\Storage::disk($disk)->url($path);
    }
}
