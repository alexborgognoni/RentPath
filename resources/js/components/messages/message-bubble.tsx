import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Image as ImageIcon } from 'lucide-react';

interface Attachment {
    id: number;
    original_name: string;
    mime_type: string;
    formatted_size: string;
    url: string | null;
}

interface MessageBubbleProps {
    body: string;
    senderName: string;
    senderRole: 'manager' | 'participant';
    createdAt: string;
    attachments?: Attachment[];
    isOwnMessage: boolean;
}

export function MessageBubble({ body, senderName, createdAt, attachments, isOwnMessage }: MessageBubbleProps) {
    const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

    return (
        <div className={cn('flex flex-col gap-1', isOwnMessage ? 'items-end' : 'items-start')}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{senderName}</span>
                <span>{timeAgo}</span>
            </div>

            <div
                className={cn('max-w-[80%] rounded-2xl px-4 py-2', isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground')}
            >
                <p className="break-words whitespace-pre-wrap">{body}</p>
            </div>

            {attachments && attachments.length > 0 && (
                <div className={cn('mt-1 flex flex-col gap-1', isOwnMessage ? 'items-end' : 'items-start')}>
                    {attachments.map((attachment) => (
                        <a
                            key={attachment.id}
                            href={attachment.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-accent',
                                isOwnMessage ? 'border-primary/20 bg-primary/10' : 'border-border bg-background',
                            )}
                        >
                            {attachment.mime_type.startsWith('image/') ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                            <span className="max-w-48 truncate">{attachment.original_name}</span>
                            <span className="text-xs text-muted-foreground">({attachment.formatted_size})</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
