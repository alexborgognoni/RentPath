<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendMessageRequest;
use App\Http\Requests\StartConversationRequest;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\MessageAttachment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    /**
     * Display a listing of conversations for the manager.
     */
    public function index(): Response
    {
        $propertyManager = Auth::user()->propertyManager;

        if (! $propertyManager) {
            abort(403, 'You must be a property manager to access messages.');
        }

        $conversations = Conversation::forManager($propertyManager->id)
            ->withActivity()
            ->with('latestMessage')
            ->get()
            ->map(function ($conversation) {
                return [
                    'id' => $conversation->id,
                    'participant_name' => $conversation->participant_name,
                    'participant_email' => $conversation->participant_email,
                    'participant_type' => $conversation->participant_type,
                    'last_message_at' => $conversation->last_message_at,
                    'has_unread' => $conversation->hasUnreadForManager(),
                    'last_message' => $conversation->latestMessage->first()?->body,
                ];
            });

        return Inertia::render('manager/messages/index', [
            'conversations' => $conversations,
        ]);
    }

    /**
     * Display the specified conversation.
     */
    public function show(Conversation $conversation): Response
    {
        $this->authorize('viewAsManager', $conversation);

        // Mark as read
        $conversation->markAsReadByManager();

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

        return Inertia::render('manager/messages/show', [
            'conversation' => [
                'id' => $conversation->id,
                'participant_name' => $conversation->participant_name,
                'participant_email' => $conversation->participant_email,
                'participant_type' => $conversation->participant_type,
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
            'sender_role' => Message::SENDER_ROLE_MANAGER,
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

        // Mark as read by manager since they just sent a message
        $conversation->markAsReadByManager();

        return back();
    }

    /**
     * Start or get existing conversation with a participant.
     */
    public function startConversation(StartConversationRequest $request): RedirectResponse
    {
        $propertyManager = Auth::user()->propertyManager;
        $validated = $request->validated();

        $conversation = Conversation::getOrCreateBetween(
            $propertyManager->id,
            $validated['participant_type'],
            $validated['participant_id']
        );

        return redirect()->route('manager.messages.show', $conversation);
    }

    /**
     * Get unread count for nav badge (AJAX endpoint).
     */
    public function unreadCount()
    {
        $propertyManager = Auth::user()->propertyManager;

        if (! $propertyManager) {
            return response()->json(['count' => 0]);
        }

        $count = Conversation::forManager($propertyManager->id)
            ->get()
            ->filter(fn ($c) => $c->hasUnreadForManager())
            ->count();

        return response()->json(['count' => $count]);
    }
}
