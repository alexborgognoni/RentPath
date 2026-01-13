import type { SharedData } from '@/types';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { router, usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';

interface CreateLeadModalProps {
    properties: Array<{ id: number; title: string }>;
    isOpen: boolean;
    onClose: () => void;
    preselectedPropertyId?: number;
}

export function CreateLeadModal({ properties, isOpen, onClose, preselectedPropertyId }: CreateLeadModalProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations.manager.leads, key);

    const [form, setForm] = useState({
        property_id: preselectedPropertyId?.toString() || '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        notes: '',
        source: 'invite',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        const newErrors: Record<string, string> = {};
        if (!form.property_id) {
            newErrors.property_id = t('propertyRequired');
        }
        if (!form.email) {
            newErrors.email = t('emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = t('emailInvalid');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setProcessing(true);
        router.post(
            route('manager.leads.store'),
            {
                property_id: parseInt(form.property_id),
                email: form.email,
                first_name: form.first_name || null,
                last_name: form.last_name || null,
                phone: form.phone || null,
                notes: form.notes || null,
                source: form.source,
            },
            {
                onSuccess: () => {
                    setForm({
                        property_id: '',
                        email: '',
                        first_name: '',
                        last_name: '',
                        phone: '',
                        notes: '',
                        source: 'invite',
                    });
                    setErrors({});
                    onClose();
                },
                onError: (errors) => {
                    setErrors(errors as Record<string, string>);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl">
                <button onClick={onClose} className="absolute top-4 right-4 cursor-pointer text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                </button>

                <h2 className="mb-2 text-xl font-semibold text-foreground">{t('createLeadTitle')}</h2>
                <p className="mb-6 text-sm text-muted-foreground">{t('createLeadDesc')}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Property Select */}
                    <div>
                        <select
                            value={form.property_id}
                            onChange={(e) => setForm({ ...form, property_id: e.target.value })}
                            className={`h-10 w-full rounded-lg border bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none ${
                                errors.property_id ? 'border-destructive' : 'border-input'
                            }`}
                        >
                            <option value="">{t('selectProperty')}</option>
                            {properties.map((property) => (
                                <option key={property.id} value={property.id}>
                                    {property.title}
                                </option>
                            ))}
                        </select>
                        {errors.property_id && <p className="mt-1 text-xs text-destructive">{errors.property_id}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            placeholder={t('emailAddress')}
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className={`h-10 w-full rounded-lg border bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none ${
                                errors.email ? 'border-destructive' : 'border-input'
                            }`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder={t('firstName')}
                            value={form.first_name}
                            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                        <input
                            type="text"
                            placeholder={t('lastName')}
                            value={form.last_name}
                            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    {/* Phone */}
                    <input
                        type="tel"
                        placeholder={t('phoneNumber')}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                    />

                    {/* Notes */}
                    <textarea
                        placeholder={t('initialNotes')}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={3}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                    />

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 cursor-pointer rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-muted"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="h-10 cursor-pointer rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            {processing ? t('sending') : t('sendInvite')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
