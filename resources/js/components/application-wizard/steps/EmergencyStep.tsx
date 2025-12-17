import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';

interface EmergencyStepProps {
    data: ApplicationWizardData;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    onBlur: () => void;
    hasProfileEmergencyContact: boolean;
}

export function EmergencyStep({ data, updateField, onBlur, hasProfileEmergencyContact }: EmergencyStepProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Emergency Contact</h2>
            <p className="text-sm text-muted-foreground">
                {hasProfileEmergencyContact
                    ? 'You can use your profile emergency contact or provide a different one for this application.'
                    : 'Provide an emergency contact for this application.'}
            </p>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <label className="mb-2 block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={data.emergency_contact_name}
                        onChange={(e) => updateField('emergency_contact_name', e.target.value)}
                        onBlur={onBlur}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">Phone</label>
                    <input
                        type="tel"
                        value={data.emergency_contact_phone}
                        onChange={(e) => updateField('emergency_contact_phone', e.target.value)}
                        onBlur={onBlur}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">Relationship</label>
                    <input
                        type="text"
                        value={data.emergency_contact_relationship}
                        onChange={(e) => updateField('emergency_contact_relationship', e.target.value)}
                        onBlur={onBlur}
                        placeholder="Parent, Sibling..."
                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                    />
                </div>
            </div>
        </div>
    );
}
