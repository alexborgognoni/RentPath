<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendMessageRequest;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\MessageAttachment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TenantMessageController extends Controller
{
    /**
     * Display a listing of conversations for the tenant.
     */
    public function index(): Response
    {
        $user = Auth::user();

        $conversations = Conversation::forParticipant(
            Conversation::PARTICIPANT_TYPE_TENANT,
            $user->id
        )
            ->withActivity()
            ->with('propertyManager.user')
            ->get()
            ->map(function ($conversation) {
                $manager = $conversation->propertyManager;

                return [
                    'id' => $conversation->id,
                    'manager_name' => $manager->company_name ?? $manager->user->name ?? 'Property Manager',
                    'last_message_at' => $conversation->last_message_at,
                    'has_unread' => $conversation->hasUnreadForParticipant(),
                    'last_message' => $conversation->messages()->latest('created_at')->first()?->body,
                ];
            });

        return Inertia::render('tenant/messages/index', [
            'conversations' => $conversations,
        ]);
    }

    /**
     * Display the specified conversation.
     */
    public function show(Conversation $conversation): Response
    {
        $this->authorize('viewAsParticipant', $conversation);

        // Mark as read
        $conversation->markAsReadByParticipant();

        // Load property manager info
        $manager = $conversation->propertyManager;

        // Load messages with attachments
        $messages = $conversation->messages()
            ->with('attachments')
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'sender_role' => $message->sender_role,
                    'sender_name' => $message->sender_name,
                    'body' => $message->body,
                    'created_at' => $message->created_at,
                    'attachments' => $message->attachments,
                ];
            });

        return Inertia::render('tenant/messages/show', [
            'conversation' => [
                'id' => $conversation->id,
                'manager_name' => $manager->company_name ?? $manager->user->name ?? 'Property Manager',
            ],
            'messages' => $messages,
        ]);
    }

    /**
     * Store a new message in the conversation.
     */
    public function store(SendMessageRequest $request, Conversation $conversation): RedirectResponse
    {
        $this->authorize('sendMessage', $conversation);

        $validated = $request->validated();

        // Create the message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_role' => Message::SENDER_ROLE_PARTICIPANT,
            'body' => $validated['body'],
        ]);

        // Handle attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('message-attachments/'.$conversation->id, 'private');

                MessageAttachment::create([
                    'message_id' => $message->id,
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        }

        // Mark as read by participant since they just sent a message
        $conversation->markAsReadByParticipant();

        return back();
    }

    /**
     * Get unread count for nav badge (AJAX endpoint).
     */
    public function unreadCount()
    {
        $user = Auth::user();

        $count = Conversation::forParticipant(
            Conversation::PARTICIPANT_TYPE_TENANT,
            $user->id
        )
            ->get()
            ->filter(fn ($c) => $c->hasUnreadForParticipant())
            ->count();

        return response()->json(['count' => $count]);
    }
}
