import type { PropertyManager } from '@/types/dashboard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Edit, User } from 'lucide-react';

interface AgentProfileProps {
    agent: PropertyManager;
    onEdit: () => void;
}

export function AgentProfile({ agent, onEdit }: AgentProfileProps) {
    const { translations } = usePage<SharedData>().props;

    return (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-8 flex items-start justify-between">
                <h2 className="flex items-center text-2xl font-bold text-foreground">
                    <User className="mr-3 text-primary" size={28} />
                    {translate(translations, 'dashboard.profile')}
                </h2>
                <button
                    onClick={onEdit}
                    className="flex cursor-pointer items-center space-x-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105"
                >
                    <Edit size={16} />
                    <span>{translate(translations, 'dashboard.editProfile')}</span>
                </button>
            </div>

            <div className="flex flex-col gap-8 md:flex-row">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                    {agent.profile_picture_path ? (
                        <img src={agent.profile_picture_path} alt={agent.user?.full_name || 'Profile'} className="h-32 w-32 rounded-2xl border-4 border-secondary object-cover" />
                    ) : (
                        <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-secondary bg-gradient-to-br from-muted to-muted/50">
                            <span className="text-3xl font-bold text-primary">
                                {agent.user?.full_name?.charAt(0).toUpperCase() || agent.company_name?.charAt(0).toUpperCase() || 'P'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Profile Info */}
                <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">Name</p>
                        <p className="text-lg font-semibold text-foreground">{agent.user?.full_name || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">Email</p>
                        <p className="text-lg font-semibold text-foreground">{agent.user?.email || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">Phone</p>
                        <p className="text-lg font-semibold text-foreground">{agent.phone_number || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">Type</p>
                        <p className="text-lg font-semibold text-foreground">
                            {agent.type === 'individual' ? 'Individual' : 'Professional'}
                        </p>
                    </div>
                    {agent.type === 'professional' && (
                        <>
                            <div>
                                <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">Company</p>
                                <p className="text-lg font-semibold text-foreground">{agent.company_name || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">License Number</p>
                                <p className="text-lg font-semibold text-foreground">{agent.license_number || 'Not provided'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">Company Website</p>
                                {agent.company_website ? (
                                    <a
                                        href={agent.company_website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg font-semibold text-primary transition-colors hover:text-primary/80"
                                    >
                                        {agent.company_website}
                                    </a>
                                ) : (
                                    <p className="text-lg font-semibold text-foreground">Not provided</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
