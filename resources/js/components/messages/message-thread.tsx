import { useEffect, useRef } from 'react';
import { MessageBubble } from './message-bubble';

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

interface MessageThreadProps {
    messages: Message[];
    currentUserRole: 'manager' | 'participant';
}

export function MessageThread({ messages, currentUserRole }: MessageThreadProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-muted-foreground">
                <p>No messages yet. Start the conversation!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    body={message.body}
                    senderName={message.sender_name}
                    senderRole={message.sender_role}
                    createdAt={message.created_at}
                    attachments={message.attachments}
                    isOwnMessage={message.sender_role === currentUserRole}
                />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
