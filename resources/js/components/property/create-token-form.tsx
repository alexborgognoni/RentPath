import { X } from 'lucide-react';
import { useState } from 'react';

interface CreateTokenFormProps {
    propertyId: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export function CreateTokenForm({ propertyId, onSuccess, onCancel }: CreateTokenFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'private' as 'private' | 'invite',
        email: '',
        max_uses: '',
        expires_at: '',
    });
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper to set expiry to X days from now
    const setExpiryDaysFromNow = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        setFormData({ ...formData, expires_at: date.toISOString().split('T')[0] });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setCreating(true);

        try {
            // Build request payload
            const payload: {
                name?: string;
                type: 'private' | 'invite';
                email?: string;
                max_uses?: number;
                expires_at?: string;
            } = {
                type: formData.type,
            };

            if (formData.name.trim()) {
                payload.name = formData.name.trim();
            }

            if (formData.type === 'invite') {
                if (!formData.email.trim()) {
                    setError('Email is required for invite-only links');
                    setCreating(false);
                    return;
                }
                payload.email = formData.email.trim();
            }

            if (formData.max_uses) {
                const maxUses = parseInt(formData.max_uses, 10);
                if (maxUses > 0) {
                    payload.max_uses = maxUses;
                }
            }

            if (formData.expires_at) {
                payload.expires_at = formData.expires_at;
            }

            const response = await fetch(`/properties/${propertyId}/invite-tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onSuccess();
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to create invite link');
            }
        } catch (err) {
            console.error('Failed to create token:', err);
            setError('An error occurred while creating the invite link');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="rounded-lg border border-border bg-background/80 p-4">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Create Custom Invite Link</h3>
                <button
                    onClick={onCancel}
                    className="cursor-pointer rounded-lg p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                >
                    <X size={18} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
                        Name (optional)
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Open House Link"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>

                {/* Type */}
                <div>
                    <label htmlFor="type" className="mb-1 block text-sm font-medium text-foreground">
                        Link Type
                    </label>
                    <select
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'private' | 'invite' })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <option value="private">Private (anyone with link)</option>
                        <option value="invite">Invite (email-restricted)</option>
                    </select>
                </div>

                {/* Email (only for invite type) */}
                {formData.type === 'invite' && (
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
                            Email Address <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="applicant@example.com"
                            required={formData.type === 'invite'}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">Only this email can use this link</p>
                    </div>
                )}

                {/* Max Uses */}
                <div>
                    <label htmlFor="max_uses" className="mb-1 block text-sm font-medium text-foreground">
                        Max Uses (optional)
                    </label>
                    <input
                        type="number"
                        id="max_uses"
                        value={formData.max_uses}
                        onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                        placeholder="Leave empty for unlimited"
                        min="1"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>

                {/* Expiration */}
                <div>
                    <label htmlFor="expires_at" className="mb-1 block text-sm font-medium text-foreground">
                        Expiration Date (optional)
                    </label>

                    {/* Quick preset buttons */}
                    <div className="mb-2 flex gap-2">
                        <button
                            type="button"
                            onClick={() => setExpiryDaysFromNow(7)}
                            className="cursor-pointer rounded bg-muted px-2 py-1 text-xs text-foreground transition-colors hover:bg-muted/80"
                        >
                            7 days
                        </button>
                        <button
                            type="button"
                            onClick={() => setExpiryDaysFromNow(30)}
                            className="cursor-pointer rounded bg-muted px-2 py-1 text-xs text-foreground transition-colors hover:bg-muted/80"
                        >
                            30 days
                        </button>
                        <button
                            type="button"
                            onClick={() => setExpiryDaysFromNow(90)}
                            className="cursor-pointer rounded bg-muted px-2 py-1 text-xs text-foreground transition-colors hover:bg-muted/80"
                        >
                            90 days
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, expires_at: '' })}
                            className="cursor-pointer rounded bg-muted px-2 py-1 text-xs text-foreground transition-colors hover:bg-muted/80"
                        >
                            Never
                        </button>
                    </div>

                    <input
                        type="date"
                        id="expires_at"
                        value={formData.expires_at}
                        onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Leave empty for no expiration</p>
                </div>

                {/* Error Message */}
                {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 cursor-pointer rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-background/80"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={creating}
                        className="flex-1 cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {creating ? 'Creating...' : 'Create Link'}
                    </button>
                </div>
            </form>
        </div>
    );
}
