import type { Agent } from '@/types/dashboard';
import { translate as t } from '@/utils/translate-utils';
import { Edit, User } from 'lucide-react';

interface AgentProfileProps {
    agent: Agent;
    onEdit: () => void;
}

export function AgentProfile({ agent, onEdit }: AgentProfileProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-8 flex items-start justify-between">
                <h2 className="flex items-center text-2xl font-bold text-foreground">
                    <User className="mr-3 text-primary" size={28} />
                    {t('profile')}
                </h2>
                <button
                    onClick={onEdit}
                    className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105"
                >
                    <Edit size={16} />
                    <span>{t('editProfile')}</span>
                </button>
            </div>

            <div className="flex flex-col gap-8 md:flex-row">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                    {agent.profile_picture ? (
                        <img src={agent.profile_picture} alt={agent.name} className="h-32 w-32 rounded-2xl border-4 border-secondary object-cover" />
                    ) : (
                        <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-secondary bg-gradient-to-br from-muted to-muted/50">
                            <span className="text-3xl font-bold text-primary">{agent.name.charAt(0).toUpperCase()}</span>
                        </div>
                    )}
                </div>

                {/* Profile Info */}
                <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">{t('name')}</p>
                        <p className="text-lg font-semibold text-foreground">{agent.name}</p>
                    </div>
                    <div>
                        <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">{t('email')}</p>
                        <p className="text-lg font-semibold text-foreground">{agent.email}</p>
                    </div>
                    <div>
                        <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">{t('phone')}</p>
                        <p className="text-lg font-semibold text-foreground">{agent.phone || t('notProvided')}</p>
                    </div>
                    <div>
                        <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">{t('role')}</p>
                        <p className="text-lg font-semibold text-foreground">
                            {agent.user_role === 'private_owner' ? t('privateOwner') : t('agentManager')}
                        </p>
                    </div>
                    {agent.user_role === 'agent' && (
                        <>
                            <div>
                                <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">{t('company')}</p>
                                <p className="text-lg font-semibold text-foreground">{agent.company || t('notProvided')}</p>
                            </div>
                            <div>
                                <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">{t('nationalAgencyId')}</p>
                                <p className="text-lg font-semibold text-foreground">{agent.national_agency_id_number || t('notProvided')}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="mb-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">{t('agencyWebsite')}</p>
                                {agent.agency_website ? (
                                    <a
                                        href={agent.agency_website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg font-semibold text-primary transition-colors hover:text-primary/80"
                                    >
                                        {agent.agency_website}
                                    </a>
                                ) : (
                                    <p className="text-lg font-semibold text-foreground">{t('notProvided')}</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
