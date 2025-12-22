import { ConversationList } from '@/components/messages/conversation-list';
import { ManagerLayout } from '@/layouts/manager-layout';
import { route } from '@/utils/route';
import { Head } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';

interface Conversation {
    id: number;
    participant_name: string;
    participant_email: string | null;
    participant_type: 'lead' | 'tenant';
    last_message_at: string | null;
    has_unread: boolean;
    last_message: string | null;
}

interface MessagesIndexProps {
    conversations: Conversation[];
}

export default function MessagesIndex({ conversations }: MessagesIndexProps) {
    return (
        <ManagerLayout>
            <Head title="Messages" />

            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground">
                        <MessageCircle className="h-7 w-7 text-primary" />
                        <span>Messages ({conversations.length})</span>
                    </h1>
                </div>

                {/* Conversations List */}
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <ConversationList
                        conversations={conversations}
                        getConversationHref={(id) => route('manager.messages.show', { conversation: id })}
                        emptyMessage="No conversations yet. Start chatting with leads or tenants from their detail pages."
                        isManager={true}
                    />
                </div>
            </div>
        </ManagerLayout>
    );
}
