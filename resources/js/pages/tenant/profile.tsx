import {
    AddressSection,
    EmploymentSection,
    IdentitySection,
    PersonalSection,
    PrivacyDataCard,
    ProfileCompleteness,
    ProfileHeader,
    ProfileSection,
} from '@/components/profile';
import { SaveStatus } from '@/components/ui/save-status';
import { useProfileForm, type ProfileDocuments, type SectionId } from '@/hooks/use-profile-form';
import { TenantLayout } from '@/layouts/tenant-layout';
import type { SharedData, TenantProfile } from '@/types';
import { translate } from '@/utils/translate-utils';
import { Head, usePage } from '@inertiajs/react';
import { Briefcase, Home, Shield, User } from 'lucide-react';
import { useCallback } from 'react';

interface ProfilePageProps {
    profile: TenantProfile | null;
    hasProfile: boolean;
    completeness: number;
    documents: {
        id_document: boolean;
        proof_of_income: boolean;
        reference_letter: boolean;
    };
    profileDocuments?: ProfileDocuments;
}

const SECTION_ICONS: Record<SectionId, React.ComponentType<{ className?: string }>> = {
    personal: User,
    address: Home,
    identity: Shield,
    employment: Briefcase,
};

export default function ProfilePage({ profile, profileDocuments }: ProfilePageProps) {
    const { auth, translations } = usePage<SharedData>().props;
    const t = translations.tenant.profile;

    // Initialize the profile form hook
    const form = useProfileForm({
        initialProfile: profile,
        profileDocuments: profileDocuments || {},
    });

    // Section click handler for completeness meter
    const handleSectionClick = useCallback(
        (sectionId: SectionId) => {
            // First expand the section
            form.expandSection(sectionId);

            // Wait for the expand animation to start, then scroll to center of section
            setTimeout(() => {
                const element = document.getElementById(`section-${sectionId}`);
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
        },
        [form],
    );

    return (
        <TenantLayout>
            <Head title={translate(t, 'title')} />

            <div className="space-y-6">
                {/* Header with inline save status */}
                <div className="flex items-start justify-between gap-4">
                    <ProfileHeader user={auth.user} verificationStatus={profile?.profile_verified_at ? 'verified' : null} translations={t} />
                    <SaveStatus status={form.autosaveStatus} lastSavedAt={form.lastSavedAt} onSave={form.saveNow} className="shrink-0" />
                </div>

                {/* Two-column layout: main content left, sidebar right */}
                <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
                    {/* Main Content */}
                    <main className="order-2 space-y-4 lg:order-1">
                        {/* Personal Section */}
                        <div id="section-personal">
                            <ProfileSection
                                id="personal"
                                title={translate(t, 'sections.personal')}
                                icon={SECTION_ICONS.personal}
                                isComplete={form.sectionStatuses.find((s) => s.id === 'personal')?.isComplete ?? false}
                                isExpanded={form.expandedSections.has('personal')}
                                onToggle={() => form.toggleSection('personal')}
                                translations={t}
                            >
                                <PersonalSection form={form} user={auth.user} />
                            </ProfileSection>
                        </div>

                        {/* Address Section */}
                        <div id="section-address">
                            <ProfileSection
                                id="address"
                                title={translate(t, 'sections.address')}
                                icon={SECTION_ICONS.address}
                                isComplete={form.sectionStatuses.find((s) => s.id === 'address')?.isComplete ?? false}
                                isExpanded={form.expandedSections.has('address')}
                                onToggle={() => form.toggleSection('address')}
                                translations={t}
                            >
                                <AddressSection form={form} />
                            </ProfileSection>
                        </div>

                        {/* Identity Section */}
                        <div id="section-identity">
                            <ProfileSection
                                id="identity"
                                title={translate(t, 'sections.identity')}
                                icon={SECTION_ICONS.identity}
                                isComplete={form.sectionStatuses.find((s) => s.id === 'identity')?.isComplete ?? false}
                                isExpanded={form.expandedSections.has('identity')}
                                onToggle={() => form.toggleSection('identity')}
                                translations={t}
                            >
                                <IdentitySection form={form} />
                            </ProfileSection>
                        </div>

                        {/* Employment Section */}
                        <div id="section-employment">
                            <ProfileSection
                                id="employment"
                                title={translate(t, 'sections.employment')}
                                icon={SECTION_ICONS.employment}
                                isComplete={form.sectionStatuses.find((s) => s.id === 'employment')?.isComplete ?? false}
                                isExpanded={form.expandedSections.has('employment')}
                                onToggle={() => form.toggleSection('employment')}
                                translations={t}
                            >
                                <EmploymentSection form={form} />
                            </ProfileSection>
                        </div>
                    </main>

                    {/* Completeness Sidebar - Right side, sticky on desktop */}
                    <aside className="order-1 space-y-4 lg:sticky lg:top-[5.5rem] lg:order-2 lg:self-start">
                        <ProfileCompleteness
                            completeness={form.completeness}
                            sections={form.sectionStatuses}
                            nextSuggestion={form.nextSuggestion}
                            onSectionClick={handleSectionClick}
                            translations={t}
                        />
                        <PrivacyDataCard translations={t} />
                    </aside>
                </div>
            </div>
        </TenantLayout>
    );
}
