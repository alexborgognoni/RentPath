import { ConversationList } from '@/components/messages/conversation-list';
import { TenantLayout } from '@/layouts/tenant-layout';
import { route } from '@/utils/route';
import { Head } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';

interface Conversation {
    id: number;
    manager_name: string;
    last_message_at: string | null;
    has_unread: boolean;
    last_message: string | null;
}

interface MessagesIndexProps {
    conversations: Conversation[];
}

export default function MessagesIndex({ conversations }: MessagesIndexProps) {
    return (
        <TenantLayout>
            <Head title="Messages" />

            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-6 flex items-center gap-3">
                    <MessageCircle className="h-7 w-7 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">Messages ({conversations.length})</h1>
                </div>

                {/* Conversations List */}
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <ConversationList
                        conversations={conversations}
                        getConversationHref={(id) => route('tenant.messages.show', { conversation: id })}
                        emptyMessage="No messages yet. Property managers will be able to contact you here."
                        isManager={false}
                    />
                </div>
            </div>
        </TenantLayout>
    );
}
