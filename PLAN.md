# Messaging Feature Implementation Plan

## Overview

Direct 1:1 messaging between PropertyManagers and Leads/Tenants. Simple chat functionality without property scoping or notification infrastructure.

### Scope

- [x] 1:1 messaging (manager ↔ lead OR manager ↔ tenant)
- [x] File attachments (reuse existing S3 pattern)
- [x] Messages page with conversation list + chat view
- [x] "Chat" button on Lead/Application detail pages
- [x] Unread indicators (timestamp-based)
- [ ] ~~Email notifications~~ → Deferred to unified notification system
- [ ] ~~Property scoping~~ → Can add later if needed
- [ ] ~~Group chat~~ → Future phase

---

## Database Schema

### conversations

| Column                   | Type      | Description                   |
| ------------------------ | --------- | ----------------------------- |
| id                       | bigint    | Primary key                   |
| property_manager_id      | bigint    | FK → property_managers        |
| participant_type         | enum      | `lead` or `tenant`            |
| participant_id           | bigint    | FK → leads or tenant_profiles |
| last_message_at          | timestamp | For sorting conversations     |
| manager_last_read_at     | timestamp | When manager last viewed      |
| participant_last_read_at | timestamp | When participant last viewed  |
| created_at               | timestamp |                               |
| updated_at               | timestamp |                               |

**Indexes:**

- `(property_manager_id)` - Manager's inbox query
- `(participant_type, participant_id)` - Participant's inbox query
- `(property_manager_id, participant_type, participant_id)` UNIQUE - One conversation per pair

### messages

| Column          | Type      | Description                |
| --------------- | --------- | -------------------------- |
| id              | bigint    | Primary key                |
| conversation_id | bigint    | FK → conversations         |
| sender_role     | enum      | `manager` or `participant` |
| body            | text      | Message content            |
| created_at      | timestamp |                            |

**Indexes:**

- `(conversation_id, created_at)` - Fetching messages in order

### message_attachments

| Column        | Type      | Description              |
| ------------- | --------- | ------------------------ |
| id            | bigint    | Primary key              |
| message_id    | bigint    | FK → messages            |
| file_path     | varchar   | S3 path (private bucket) |
| original_name | varchar   | Original filename        |
| mime_type     | varchar   | File MIME type           |
| size          | int       | File size in bytes       |
| created_at    | timestamp |                          |

---

## Backend Implementation

### Models

**App\Models\Conversation**

```php
// Relationships
- propertyManager(): BelongsTo PropertyManager
- messages(): HasMany Message
- participant(): Dynamic relation based on participant_type

// Accessors
- getUnreadCountForManager(): int
- getUnreadCountForParticipant(): int
- getParticipantNameAttribute(): string

// Scopes
- forManager($propertyManagerId)
- forParticipant($type, $id)

// Methods
- markAsReadByManager(): void
- markAsReadByParticipant(): void
- getOrCreateBetween($propertyManagerId, $participantType, $participantId): Conversation
```

**App\Models\Message**

```php
// Relationships
- conversation(): BelongsTo Conversation
- attachments(): HasMany MessageAttachment

// After create: Update conversation.last_message_at
```

**App\Models\MessageAttachment**

```php
// Relationships
- message(): BelongsTo Message

// Accessors
- getUrlAttribute(): string (signed URL via StorageHelper)
```

### Controllers

**App\Http\Controllers\Manager\MessageController**

```php
- index(): Inertia page with conversation list
- show(Conversation): Inertia page with messages, mark as read
- store(Conversation, Request): Send message, return message data
- startConversation(Request): Create or get conversation, redirect to show
```

**App\Http\Controllers\Tenant\MessageController**

```php
- index(): Inertia page with conversation list
- show(Conversation): Inertia page with messages, mark as read
- store(Conversation, Request): Send message, return message data
```

**App\Http\Controllers\MessageAttachmentController**

```php
- store(Conversation, Request): Upload attachment, return attachment data
- show(MessageAttachment): Serve file via signed URL redirect
```

### Form Requests

**App\Http\Requests\SendMessageRequest**

```php
- body: required|string|max:10000
- attachments: nullable|array
- attachments.*: file|max:10240|mimes:jpg,jpeg,png,gif,pdf,doc,docx
```

### Routes

**Manager Routes (manager subdomain)**

```php
Route::middleware(['auth', 'verified', 'has-property-manager-profile'])->group(function () {
    Route::get('/messages', [Manager\MessageController::class, 'index'])->name('manager.messages.index');
    Route::get('/messages/{conversation}', [Manager\MessageController::class, 'show'])->name('manager.messages.show');
    Route::post('/messages/{conversation}', [Manager\MessageController::class, 'store'])->name('manager.messages.store');
    Route::post('/messages/start', [Manager\MessageController::class, 'startConversation'])->name('manager.messages.start');
});
```

**Tenant Routes (main domain)**

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/messages', [Tenant\MessageController::class, 'index'])->name('tenant.messages.index');
    Route::get('/messages/{conversation}', [Tenant\MessageController::class, 'show'])->name('tenant.messages.show');
    Route::post('/messages/{conversation}', [Tenant\MessageController::class, 'store'])->name('tenant.messages.store');
});
```

### Authorization

**App\Policies\ConversationPolicy**

```php
- viewAsManager(User, Conversation): User's PropertyManager owns conversation
- viewAsParticipant(User, Conversation): User's TenantProfile/Lead matches participant
- sendMessage(User, Conversation): Either of above
```

---

## Frontend Implementation

### Pages

**Manager Portal**

`resources/js/Pages/Manager/Messages/Index.tsx`

- Left sidebar: Conversation list with unread indicators
- Right panel: Selected conversation or empty state
- Each conversation item shows: participant name, last message preview, time, unread dot

`resources/js/Pages/Manager/Messages/Show.tsx`

- Full conversation view (can also be embedded in Index for desktop)
- Message list with infinite scroll (load older messages)
- Message input with file attachment button
- Participant info header

**Tenant Portal**

`resources/js/Pages/Tenant/Messages/Index.tsx`

- Similar to manager but from tenant perspective
- Shows property manager name/company

`resources/js/Pages/Tenant/Messages/Show.tsx`

- Conversation view

### Components

```
resources/js/Components/Messages/
├── ConversationList.tsx      # List of conversations with unread state
├── ConversationItem.tsx      # Single conversation preview
├── MessageThread.tsx         # List of messages in a conversation
├── MessageBubble.tsx         # Single message display
├── MessageInput.tsx          # Text input + attachment button + send
├── AttachmentPreview.tsx     # Preview of attached files
├── AttachmentUpload.tsx      # File picker + upload progress
└── EmptyConversation.tsx     # Empty state when no conversation selected
```

### Chat Button Integration

**Lead Detail Page** (`resources/js/Pages/Manager/Leads/Show.tsx`)

- Add "Chat" button in header/actions area
- On click: POST to `/messages/start` with `participant_type=lead&participant_id={lead.id}`
- Redirects to conversation

**Application Detail Page** (Manager side)

- Add "Chat" button
- On click: POST to `/messages/start` with `participant_type=tenant&participant_id={application.tenant_profile_id}`
- Redirects to conversation

**Application Detail Page** (Tenant side)

- Add "Message Landlord" button
- On click: Navigate to existing conversation or show message compose

### Navigation Updates

**Manager Layout** - Add "Messages" nav item with unread count badge
**Tenant Layout** - Add "Messages" nav item with unread count badge

---

## Implementation Order

### 1. Database & Models

- [ ] Create migration for conversations table
- [ ] Create migration for messages table
- [ ] Create migration for message_attachments table
- [ ] Create Conversation model with relationships and scopes
- [ ] Create Message model with relationships
- [ ] Create MessageAttachment model with signed URL accessor
- [ ] Create ConversationPolicy
- [ ] Create factories for all models

### 2. Backend API

- [ ] Create SendMessageRequest form request
- [ ] Create Manager\MessageController (index, show, store, startConversation)
- [ ] Create Tenant\MessageController (index, show, store)
- [ ] Create MessageAttachmentController (store, show)
- [ ] Add routes for manager subdomain
- [ ] Add routes for tenant domain
- [ ] Write feature tests for all endpoints

### 3. Frontend - Core Components

- [ ] Create MessageBubble component
- [ ] Create MessageThread component
- [ ] Create MessageInput component (with attachment support)
- [ ] Create AttachmentPreview component
- [ ] Create ConversationItem component
- [ ] Create ConversationList component
- [ ] Create EmptyConversation component

### 4. Frontend - Pages

- [ ] Create Manager/Messages/Index page
- [ ] Create Manager/Messages/Show page
- [ ] Create Tenant/Messages/Index page
- [ ] Create Tenant/Messages/Show page
- [ ] Add Messages nav item to manager layout (with unread badge)
- [ ] Add Messages nav item to tenant layout (with unread badge)

### 5. Integration

- [ ] Add "Chat" button to Lead detail page
- [ ] Add "Chat" button to Application detail page (manager)
- [ ] Add "Message Landlord" button to Application detail page (tenant)
- [ ] Test full flow: create conversation from lead → send messages → view in inbox

### 6. Polish

- [ ] Responsive design for mobile
- [ ] Loading states and skeletons
- [ ] Error handling
- [ ] Empty states
- [ ] Unread badge counts in nav

---

## File Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Manager/
│   │   │   └── MessageController.php
│   │   ├── Tenant/
│   │   │   └── MessageController.php
│   │   └── MessageAttachmentController.php
│   └── Requests/
│       └── SendMessageRequest.php
├── Models/
│   ├── Conversation.php
│   ├── Message.php
│   └── MessageAttachment.php
└── Policies/
    └── ConversationPolicy.php

database/
├── factories/
│   ├── ConversationFactory.php
│   ├── MessageFactory.php
│   └── MessageAttachmentFactory.php
└── migrations/
    ├── xxxx_create_conversations_table.php
    ├── xxxx_create_messages_table.php
    └── xxxx_create_message_attachments_table.php

resources/js/
├── Components/
│   └── Messages/
│       ├── ConversationList.tsx
│       ├── ConversationItem.tsx
│       ├── MessageThread.tsx
│       ├── MessageBubble.tsx
│       ├── MessageInput.tsx
│       ├── AttachmentPreview.tsx
│       ├── AttachmentUpload.tsx
│       └── EmptyConversation.tsx
└── Pages/
    ├── Manager/
    │   └── Messages/
    │       ├── Index.tsx
    │       └── Show.tsx
    └── Tenant/
        └── Messages/
            ├── Index.tsx
            └── Show.tsx

tests/Feature/
├── Manager/
│   └── MessageTest.php
└── Tenant/
    └── MessageTest.php
```

---

## Open Questions

1. **Message editing/deletion?** - Not included in MVP. Add later if needed.
2. **Typing indicators?** - Requires websockets, defer to future.
3. **Message reactions?** - Not included in MVP.
4. **Max attachments per message?** - Suggest 5 files, 10MB each.
5. **Conversation archiving?** - Not in MVP, just delete or keep.
