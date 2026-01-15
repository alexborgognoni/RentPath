import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Paperclip, Send, X } from 'lucide-react';
import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

interface MessageInputProps {
    storeRoute: string;
}

export function MessageInput({ storeRoute }: MessageInputProps) {
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        body: '',
        attachments: [] as File[],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!data.body.trim() && files.length === 0) return;

        // Update attachments in form data before submitting
        setData('attachments', files);

        post(storeRoute, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setFiles([]);
            },
        });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length + files.length <= 5) {
            setFiles([...files, ...selectedFiles]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit} className="border-t border-border bg-background p-4">
            {files.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm">
                            <span className="max-w-36 truncate">{file.name}</span>
                            <button type="button" onClick={() => removeFile(index)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={files.length >= 5}
                    title="Attach files"
                >
                    <Paperclip className="h-4 w-4" />
                </Button>

                <Textarea
                    value={data.body}
                    onChange={(e) => setData('body', e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="max-h-32 min-h-11 resize-none"
                    rows={1}
                />

                <Button type="submit" disabled={processing || (!data.body.trim() && files.length === 0)}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>

            {errors.body && <p className="mt-2 text-sm text-destructive">{errors.body}</p>}
            {errors.attachments && <p className="mt-2 text-sm text-destructive">{errors.attachments}</p>}
        </form>
    );
}
