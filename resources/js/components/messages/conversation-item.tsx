import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';

interface ConversationItemProps {
    name: string;
    email?: string | null;
    lastMessage?: string | null;
    lastMessageAt?: string | null;
    hasUnread: boolean;
    href: string;
    isActive?: boolean;
}

export function ConversationItem({ name, email, lastMessage, lastMessageAt, hasUnread, href, isActive }: ConversationItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                'flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-accent',
                isActive && 'bg-accent',
                hasUnread && 'border-primary/50',
            )}
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <h3 className={cn('truncate font-medium', hasUnread && 'font-semibold')}>{name}</h3>
                    {lastMessageAt && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(lastMessageAt), { addSuffix: true })}
                        </span>
                    )}
                </div>

                {email && <p className="truncate text-sm text-muted-foreground">{email}</p>}

                {lastMessage && <p className={cn('mt-1 truncate text-sm', hasUnread ? 'text-foreground' : 'text-muted-foreground')}>{lastMessage}</p>}
            </div>

            {hasUnread && <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
        </Link>
    );
}
