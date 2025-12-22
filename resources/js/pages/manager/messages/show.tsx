import { MessageInput } from '@/components/messages/message-input';
import { MessageThread } from '@/components/messages/message-thread';
import { Button } from '@/components/ui/button';
import { ManagerLayout } from '@/layouts/manager-layout';
import { route } from '@/utils/route';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Mail, User } from 'lucide-react';

interface Attachment {
    id: number;
    original_name: string;
    mime_type: string;
    formatted_size: string;
    url: string | null;
}

interface Message {
    id: number;
    sender_role: 'manager' | 'participant';
    sender_name: string;
    body: string;
    created_at: string;
    attachments: Attachment[];
}

interface Conversation {
    id: number;
    participant_name: string;
    participant_email: string | null;
    participant_type: 'lead' | 'tenant';
}

interface MessagesShowProps {
    conversation: Conversation;
    messages: Message[];
}

export default function MessagesShow({ conversation, messages }: MessagesShowProps) {
    return (
        <ManagerLayout>
            <Head title={`Chat with ${conversation.participant_name}`} />

            <div className="flex h-[calc(100vh-120px)] flex-col rounded-xl border border-border bg-card shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-border p-4">
                    <Link href={route('manager.messages.index')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                        <h2 className="font-semibold">{conversation.participant_name}</h2>
                        {conversation.participant_email && (
                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {conversation.participant_email}
                            </p>
                        )}
                    </div>

                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">{conversation.participant_type}</span>
                </div>

                {/* Messages */}
                <MessageThread messages={messages} currentUserRole="manager" />

                {/* Input */}
                <MessageInput storeRoute={route('manager.messages.store', { conversation: conversation.id })} />
            </div>
        </ManagerLayout>
    );
}
