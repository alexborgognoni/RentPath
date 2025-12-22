import { MessageInput } from '@/components/messages/message-input';
import { MessageThread } from '@/components/messages/message-thread';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/layouts/app-layout';
import { route } from '@/utils/route';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building } from 'lucide-react';

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
    manager_name: string;
}

interface MessagesShowProps {
    conversation: Conversation;
    messages: Message[];
}

export default function MessagesShow({ conversation, messages }: MessagesShowProps) {
    return (
        <AppLayout>
            <Head title={`Chat with ${conversation.manager_name}`} />

            <div className="container mx-auto max-w-4xl px-4 py-8">
                <div className="flex h-[calc(100vh-200px)] flex-col rounded-xl border border-border bg-card shadow-sm">
                    {/* Header */}
                    <div className="flex items-center gap-4 border-b border-border p-4">
                        <Link href={route('tenant.messages.index')}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Building className="h-5 w-5" />
                        </div>

                        <div className="flex-1">
                            <h2 className="font-semibold">{conversation.manager_name}</h2>
                            <p className="text-sm text-muted-foreground">Property Manager</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <MessageThread messages={messages} currentUserRole="participant" />

                    {/* Input */}
                    <MessageInput storeRoute={route('tenant.messages.store', { conversation: conversation.id })} />
                </div>
            </div>
        </AppLayout>
    );
}
