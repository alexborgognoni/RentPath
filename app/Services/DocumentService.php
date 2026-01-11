<?php

namespace App\Services;

use App\Helpers\StorageHelper;
use Illuminate\Http\UploadedFile;

class DocumentService
{
    /**
     * Upload a document, replacing any existing file at the old path.
     *
     * @param  string  $disk  Storage disk ('private' or 'public')
     * @return array{path: string, original_name: string}
     */
    public function upload(
        UploadedFile $file,
        string $folder,
        ?string $existingPath = null,
        string $disk = 'private'
    ): array {
        // Delete existing file if present
        if ($existingPath) {
            StorageHelper::delete($existingPath, $disk);
        }

        return [
            'path' => StorageHelper::store($file, $folder, $disk),
            'original_name' => $file->getClientOriginalName(),
        ];
    }

    /**
     * Delete a document from storage.
     */
    public function delete(string $path, string $disk = 'private'): bool
    {
        return StorageHelper::delete($path, $disk);
    }

    /**
     * Process multiple document uploads for a model.
     *
     * @param  array<string, array{folder: string, path_field: string, name_field: string}>  $documentConfig
     * @return array<string, mixed> Array of field updates to apply to the model
     */
    public function processUploads(
        object $request,
        object $model,
        array $documentConfig,
        string $disk = 'private'
    ): array {
        $updates = [];

        foreach ($documentConfig as $fieldName => $config) {
            if (! $request->hasFile($fieldName)) {
                continue;
            }

            $pathField = $config['path_field'];
            $nameField = $config['name_field'];
            $existingPath = $model->{$pathField} ?? null;

            $result = $this->upload(
                $request->file($fieldName),
                $config['folder'],
                $existingPath,
                $disk
            );

            $updates[$pathField] = $result['path'];
            $updates[$nameField] = $result['original_name'];
        }

        return $updates;
    }

    /**
     * Get signed URL for a document.
     */
    public function getUrl(string $path, string $disk = 'private', int $expiration = 60): ?string
    {
        if (empty($path)) {
            return null;
        }

        return StorageHelper::url($path, $disk, $expiration);
    }
}
