import { MessageCircle } from 'lucide-react';
import { ConversationItem } from './conversation-item';

interface Conversation {
    id: number;
    participant_name?: string;
    participant_email?: string | null;
    manager_name?: string;
    last_message?: string | null;
    last_message_at?: string | null;
    has_unread: boolean;
}

interface ConversationListProps {
    conversations: Conversation[];
    activeConversationId?: number;
    getConversationHref: (id: number) => string;
    emptyMessage?: string;
    isManager?: boolean;
}

export function ConversationList({
    conversations,
    activeConversationId,
    getConversationHref,
    emptyMessage = 'No conversations yet',
    isManager = true,
}: ConversationListProps) {
    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {conversations.map((conversation) => (
                <ConversationItem
                    key={conversation.id}
                    name={isManager ? conversation.participant_name || 'Unknown' : conversation.manager_name || 'Property Manager'}
                    email={isManager ? conversation.participant_email : undefined}
                    lastMessage={conversation.last_message}
                    lastMessageAt={conversation.last_message_at}
                    hasUnread={conversation.has_unread}
                    href={getConversationHref(conversation.id)}
                    isActive={conversation.id === activeConversationId}
                />
            ))}
        </div>
    );
}
