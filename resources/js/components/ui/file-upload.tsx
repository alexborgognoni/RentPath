import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Eye, FileText, Image, Loader2, RefreshCw, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useId, useState } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';

export type FileUploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface UploadedFile {
    originalName: string;
    path?: string;
    previewUrl?: string;
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
}: FileUploadProps) {
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
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            {existingFile.originalName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <Image className="h-5 w-5 text-primary" />
                            ) : (
                                <FileText className="h-5 w-5 text-primary" />
                            )}
                        </div>

                        {/* File info */}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{existingFile.originalName}</p>
                            <div className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Uploaded</span>
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
                        </div>
                    </div>
                </div>
            )}

            {/* Newly uploaded file display */}
            {hasUploadedFile && (
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-3 p-3">
                        {/* File icon */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            {uploadedFile.originalName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <Image className="h-5 w-5 text-primary" />
                            ) : (
                                <FileText className="h-5 w-5 text-primary" />
                            )}
                        </div>

                        {/* File info */}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{uploadedFile.originalName}</p>
                            <div className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Just uploaded</span>
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
                            {/* Only show delete button for optional documents */}
                            {!required && (
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                    title="Remove"
                                >
                                    <X className="h-4 w-4" />
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
