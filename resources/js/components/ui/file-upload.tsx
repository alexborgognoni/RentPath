import { cn } from '@/lib/utils';
import { FileIcon } from '@untitledui/file-icons';
import { AlertCircle, CheckCircle2, Download, Eye, Loader2, RefreshCw, Trash2, Upload } from 'lucide-react';
import { useCallback, useEffect, useId, useState } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';

export type FileUploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface UploadedFile {
    originalName: string;
    path?: string;
    previewUrl?: string;
    /** File size in bytes */
    size?: number;
    /** Upload timestamp (Unix timestamp in seconds) */
    uploadedAt?: number;
}

/** Get file extension from filename */
function getFileExtension(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return ext;
}

/** Format file size for display */
function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/** Format upload date for display */
function formatUploadDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export interface FileUploadProps {
    /** Document type to send to the upload endpoint */
    documentType: string;
    /** Upload endpoint URL */
    uploadUrl: string;
    /** Accepted file types (e.g., { 'image/*': ['.png', '.jpg'], 'application/pdf': ['.pdf'] }) */
    accept?: Accept;
    /** Maximum file size in bytes */
    maxSize?: number;
    /** Whether multiple files can be uploaded */
    multiple?: boolean;
    /** Maximum number of files (when multiple is true) */
    maxFiles?: number;
    /** Custom description text or structured description */
    description?:
        | string
        | {
              fileTypes?: string;
              maxFileSize?: string;
              maxFiles?: number;
          };
    /** Existing uploaded file (shows as already uploaded) */
    existingFile?: UploadedFile | null;
    /** Called when upload succeeds */
    onUploadSuccess?: (file: UploadedFile) => void;
    /** Called when upload fails */
    onUploadError?: (error: string) => void;
    /** Called when file is removed/replaced */
    onRemove?: () => void;
    /** Additional CSS classes */
    className?: string;
    /** Whether the upload is disabled */
    disabled?: boolean;
    /** Error message to display */
    error?: string;
    /** Label for the input */
    label?: string;
    /** Whether the field is required */
    required?: boolean;
    /** Whether to show delete button (default: true for non-required, false for required) */
    allowDelete?: boolean;
}

export function FileUpload({
    documentType,
    uploadUrl,
    accept,
    maxSize = 20 * 1024 * 1024, // 20MB default
    multiple = false,
    maxFiles = 1,
    description,
    existingFile,
    onUploadSuccess,
    onUploadError,
    onRemove,
    className,
    disabled = false,
    error,
    label,
    required = false,
    allowDelete,
}: FileUploadProps) {
    // Default allowDelete based on required prop if not explicitly set
    const showDeleteButton = allowDelete ?? !required;
    const id = useId();
    const [status, setStatus] = useState<FileUploadStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

    // Reset uploadedFile state when existingFile changes (e.g., after page reload)
    // This ensures we show the "existing file" UI with preview URL instead of "just uploaded" UI
    useEffect(() => {
        if (existingFile) {
            setUploadedFile(null);
            setStatus('idle');
        }
        // Only react to specific property changes, not the whole object reference
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingFile?.originalName, existingFile?.previewUrl]);

    const uploadFile = useCallback(
        async (file: File) => {
            setStatus('uploading');
            setProgress(0);
            setUploadError(null);

            const formData = new FormData();
            formData.append('document_type', documentType);
            formData.append('file', file);

            try {
                const xhr = new XMLHttpRequest();

                const fileSize = file.size;
                const uploadPromise = new Promise<UploadedFile>((resolve, reject) => {
                    xhr.upload.addEventListener('progress', (event) => {
                        if (event.lengthComputable) {
                            const pct = Math.round((event.loaded / event.total) * 100);
                            setProgress(pct);
                        }
                    });

                    xhr.addEventListener('load', () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            try {
                                const response = JSON.parse(xhr.responseText);
                                if (response.success) {
                                    resolve({
                                        originalName: response.original_name,
                                        path: response.path,
                                        size: fileSize,
                                        uploadedAt: Math.floor(Date.now() / 1000),
                                    });
                                } else {
                                    reject(new Error(response.message || 'Upload failed'));
                                }
                            } catch {
                                reject(new Error('Invalid response from server'));
                            }
                        } else {
                            try {
                                const errorResponse = JSON.parse(xhr.responseText);
                                const message =
                                    errorResponse.message ||
                                    errorResponse.errors?.file?.[0] ||
                                    'Upload failed';
                                reject(new Error(message));
                            } catch {
                                reject(new Error(`Upload failed (${xhr.status})`));
                            }
                        }
                    });

                    xhr.addEventListener('error', () => {
                        reject(new Error('Network error - please check your connection'));
                    });

                    xhr.addEventListener('abort', () => {
                        reject(new Error('Upload cancelled'));
                    });

                    xhr.open('POST', uploadUrl);
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

                    // Get CSRF token
                    const csrfToken = document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content');
                    if (csrfToken) {
                        xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
                    }

                    xhr.send(formData);
                });

                const result = await uploadPromise;
                setStatus('success');
                setUploadedFile(result);
                onUploadSuccess?.(result);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Upload failed';
                setStatus('error');
                setUploadError(errorMessage);
                onUploadError?.(errorMessage);
            }
        },
        [documentType, uploadUrl, onUploadSuccess, onUploadError],
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0 && !disabled && status !== 'uploading') {
                uploadFile(acceptedFiles[0]);
            }
        },
        accept,
        maxSize,
        multiple,
        maxFiles,
        disabled: disabled || status === 'uploading',
        noClick: false,
    });

    const handleRemove = useCallback(() => {
        setStatus('idle');
        setProgress(0);
        setUploadError(null);
        setUploadedFile(null);
        onRemove?.();
    }, [onRemove]);

    // Determine what to show
    const hasExistingFile = existingFile && !uploadedFile;
    const hasUploadedFile = uploadedFile;
    const showDropzone = !hasExistingFile && !hasUploadedFile && status !== 'uploading';
    const isUploading = status === 'uploading';
    const hasError = status === 'error' || !!error || fileRejections.length > 0;

    // Get file rejection error message
    const rejectionError = fileRejections[0]?.errors[0]?.message;
    const displayError = error || uploadError || rejectionError;

    return (
        <div className={cn('space-y-2', className)}>
            {label && <label className="block text-sm font-medium">{label}</label>}

            {/* Existing file display */}
            {hasExistingFile && (
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-3 p-3">
                        {/* File icon */}
                        <div className="shrink-0">
                            <FileIcon type={getFileExtension(existingFile.originalName)} size={40} />
                        </div>

                        {/* File info */}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{existingFile.originalName}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {existingFile.size && <span>{formatFileSize(existingFile.size)}</span>}
                                {(existingFile.size || existingFile.uploadedAt) && <span>•</span>}
                                {existingFile.uploadedAt ? (
                                    <span className="flex items-center gap-1 text-green-600">
                                        <CheckCircle2 className="h-3 w-3" />
                                        {formatUploadDate(existingFile.uploadedAt)}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-green-600">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Uploaded
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-1">
                            {existingFile.previewUrl && (
                                <a
                                    href={existingFile.previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    title="Preview"
                                >
                                    <Eye className="h-4 w-4" />
                                </a>
                            )}
                            {existingFile.previewUrl && (
                                <a
                                    href={existingFile.previewUrl}
                                    download={existingFile.originalName}
                                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    title="Download"
                                >
                                    <Download className="h-4 w-4" />
                                </a>
                            )}
                            <label
                                className="cursor-pointer rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                title="Replace"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept={accept ? Object.keys(accept).join(',') : undefined}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) uploadFile(file);
                                        e.target.value = '';
                                    }}
                                    disabled={disabled}
                                />
                            </label>
                            {showDeleteButton && (
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                    title="Delete"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Newly uploaded file display */}
            {hasUploadedFile && (
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-3 p-3">
                        {/* File icon */}
                        <div className="shrink-0">
                            <FileIcon type={getFileExtension(uploadedFile.originalName)} size={40} />
                        </div>

                        {/* File info */}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{uploadedFile.originalName}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {uploadedFile.size && <span>{formatFileSize(uploadedFile.size)}</span>}
                                {uploadedFile.size && <span>•</span>}
                                <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle2 className="h-3 w-3" />
                                    {uploadedFile.uploadedAt ? formatUploadDate(uploadedFile.uploadedAt) : 'Just now'}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-1">
                            <label
                                className="cursor-pointer rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                title="Replace"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept={accept ? Object.keys(accept).join(',') : undefined}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) uploadFile(file);
                                        e.target.value = '';
                                    }}
                                    disabled={disabled}
                                />
                            </label>
                            {showDeleteButton && (
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                    title="Delete"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Upload progress */}
            {isUploading && (
                <div className="rounded-lg border border-primary/50 bg-primary/5 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="flex-1 text-sm">Uploading... {progress}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Dropzone */}
            {showDropzone && (
                <div
                    {...getRootProps()}
                    className={cn(
                        'relative cursor-pointer rounded-lg border-2 border-dashed transition-colors',
                        {
                            'border-primary bg-primary/5': isDragActive,
                            'border-destructive bg-destructive/5': hasError,
                            'border-border hover:border-primary hover:bg-muted/50': !isDragActive && !hasError,
                            'cursor-not-allowed opacity-50': disabled,
                        },
                    )}
                >
                    <div className="flex flex-col items-center justify-center px-4 py-6">
                        <div className="mb-3">
                            {hasError ? (
                                <AlertCircle className="h-6 w-6 text-destructive" />
                            ) : (
                                <Upload className="h-6 w-6 text-muted-foreground" />
                            )}
                        </div>

                        <p className="text-sm font-medium">
                            {isDragActive ? 'Drop file here' : 'Drag and drop or click to upload'}
                        </p>

                        <p className="mt-1 text-center text-xs text-muted-foreground">
                            {typeof description === 'string' ? (
                                description
                            ) : description ? (
                                <>
                                    {description.fileTypes && `${description.fileTypes}. `}
                                    {description.maxFileSize && `Max ${description.maxFileSize}. `}
                                    {description.maxFiles &&
                                        description.maxFiles > 1 &&
                                        `Up to ${description.maxFiles} files.`}
                                </>
                            ) : null}
                        </p>

                        <input {...getInputProps()} id={id} />
                    </div>

                    {isDragActive && (
                        <div className="pointer-events-none absolute inset-0 rounded-lg bg-primary/10" />
                    )}
                </div>
            )}

            {/* Error message */}
            {displayError && <p className="text-sm text-destructive">{displayError}</p>}
        </div>
    );
}
