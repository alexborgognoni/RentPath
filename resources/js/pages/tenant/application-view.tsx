import { TenantLayout } from '@/layouts/tenant-layout';
import { type Application, type SharedData } from '@/types';
import { route } from '@/utils/route';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircle, Calendar, CheckCircle, Clock, FileText, Home, MessageCircle, User, XCircle } from 'lucide-react';
import { useState } from 'react';

interface ApplicationViewProps extends SharedData {
    application: Application;
}

export default function ApplicationView() {
    const { application } = usePage<ApplicationViewProps>().props;
    const [isStartingChat, setIsStartingChat] = useState(false);

    const handleMessageLandlord = () => {
        setIsStartingChat(true);
        router.get(route('tenant.messages.index'));
    };

    const handleWithdraw = () => {
        router.post(
            route('applications.withdraw', { application: application.id }),
            {},
            {
                onBefore: () => confirm('Are you sure you want to withdraw this application? This action cannot be undone.'),
            },
        );
    };

    const getStatusBadge = () => {
        const statusConfig: Record<string, { color: string; icon: React.ElementType; text: string }> = {
            draft: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: FileText, text: 'Draft' },
            submitted: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock, text: 'Submitted' },
            under_review: {
                color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
                icon: AlertCircle,
                text: 'Under Review',
            },
            visit_scheduled: { color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400', icon: Calendar, text: 'Visit Scheduled' },
            visit_completed: {
                color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
                icon: CheckCircle,
                text: 'Visit Completed',
            },
            approved: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle, text: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle, text: 'Rejected' },
            withdrawn: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: XCircle, text: 'Withdrawn' },
            leased: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: Home, text: 'Leased' },
            archived: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: FileText, text: 'Archived' },
        };

        const config = statusConfig[application.status] || statusConfig.draft;
        const Icon = config.icon;

        return (
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${config.color}`}>
                <Icon size={16} />
                {config.text}
            </div>
        );
    };

    const getTimeline = () => {
        const events = [];

        if (application.submitted_at) {
            events.push({ label: 'Application Submitted', date: application.submitted_at, completed: true });
        }

        if (application.reviewed_at) {
            events.push({ label: 'Under Review', date: application.reviewed_at, completed: true });
        }

        if (application.visit_scheduled_at) {
            events.push({ label: 'Visit Scheduled', date: application.visit_scheduled_at, completed: true });
        }

        if (application.visit_completed_at) {
            events.push({ label: 'Visit Completed', date: application.visit_completed_at, completed: true });
        }

        if (application.approved_at) {
            events.push({ label: 'Application Approved', date: application.approved_at, completed: true });
        }

        if (application.status === 'rejected' && application.reviewed_at) {
            events.push({ label: 'Application Rejected', date: application.reviewed_at, completed: true });
        }

        if (application.lease_signed_at) {
            events.push({ label: 'Lease Signed', date: application.lease_signed_at, completed: true });
        }

        return events;
    };

    const canWithdraw = ['submitted', 'under_review', 'visit_scheduled', 'visit_completed'].includes(application.status);

    return (
        <TenantLayout>
            <Head title={`Application for ${application.property?.title}`} />

            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold">Application Status</h1>
                        <p className="text-lg text-muted-foreground">{application.property?.title}</p>
                        <p className="text-sm text-muted-foreground">
                            {application.property?.house_number} {application.property?.street_name}, {application.property?.city}
                        </p>
                    </div>
                    <div>{getStatusBadge()}</div>
                </div>

                {/* Rejection Message */}
                {application.status === 'rejected' && application.rejection_reason && (
                    <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                        <div className="flex gap-3">
                            <XCircle className="mt-0.5 flex-shrink-0 text-red-600 dark:text-red-400" size={20} />
                            <div>
                                <p className="font-semibold text-red-600 dark:text-red-400">Application Rejected</p>
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{application.rejection_reason}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Approval Message */}
                {application.status === 'approved' && (
                    <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                        <div className="flex gap-3">
                            <CheckCircle className="mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" size={20} />
                            <div>
                                <p className="font-semibold text-green-600 dark:text-green-400">Application Approved!</p>
                                <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                                    Congratulations! The property manager will contact you soon to finalize the lease.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Timeline */}
                {getTimeline().length > 0 && (
                    <div className="mb-8 rounded-lg border border-border bg-card p-6">
                        <h2 className="mb-4 text-xl font-bold">Application Timeline</h2>
                        <div className="space-y-4">
                            {getTimeline().map((event, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                                            <CheckCircle size={16} className="text-white" />
                                        </div>
                                        {index < getTimeline().length - 1 && <div className="h-full w-0.5 flex-1 bg-gray-300"></div>}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <p className="font-semibold">{event.label}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Application Details */}
                <div className="space-y-6">
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h2 className="mb-4 text-xl font-bold">Application Details</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-1 text-muted-foreground" size={20} />
                                <div>
                                    <p className="text-sm text-muted-foreground">Desired Move-In Date</p>
                                    <p className="font-medium">
                                        {new Date(application.desired_move_in_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="mt-1 text-muted-foreground" size={20} />
                                <div>
                                    <p className="text-sm text-muted-foreground">Lease Duration</p>
                                    <p className="font-medium">{application.lease_duration_months} months</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <User className="mt-1 text-muted-foreground" size={20} />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Occupants</p>
                                    <p className="font-medium">{application.total_occupants || 1 + application.additional_occupants}</p>
                                </div>
                            </div>

                            {application.has_pets && (
                                <div className="flex items-start gap-3">
                                    <Home className="mt-1 text-muted-foreground" size={20} />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Pets</p>
                                        <p className="font-medium">Yes ({application.pets_details?.length || 0})</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {application.message_to_landlord && (
                            <div className="mt-6 border-t border-border pt-4">
                                <p className="mb-2 text-sm text-muted-foreground">Message to Landlord</p>
                                <p className="text-sm">{application.message_to_landlord}</p>
                            </div>
                        )}
                    </div>

                    {/* Property Manager Contact (for approved applications) */}
                    {application.status === 'approved' && application.property?.property_manager && (
                        <div className="rounded-lg border border-border bg-card p-6">
                            <h2 className="mb-4 text-xl font-bold">Property Manager Contact</h2>
                            <div className="space-y-3">
                                {application.property.property_manager.company_name && (
                                    <div className="flex items-center gap-3">
                                        <Home className="text-muted-foreground" size={20} />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Company</p>
                                            <p className="font-medium">{application.property.property_manager.company_name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Visit Information */}
                    {application.visit_scheduled_at && (
                        <div className="rounded-lg border border-border bg-card p-6">
                            <h2 className="mb-4 text-xl font-bold">Property Visit</h2>
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-1 text-muted-foreground" size={20} />
                                <div>
                                    <p className="text-sm text-muted-foreground">Scheduled Date & Time</p>
                                    <p className="font-medium">
                                        {new Date(application.visit_scheduled_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                            {application.visit_notes && (
                                <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                    <p className="text-sm text-blue-600 dark:text-blue-400">{application.visit_notes}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4">
                        <a href={route('applications.index')} className="rounded-lg border border-border px-6 py-3 font-medium hover:bg-muted">
                            Back to Applications
                        </a>

                        <button
                            onClick={handleMessageLandlord}
                            disabled={isStartingChat}
                            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            <MessageCircle className="h-5 w-5" />
                            Message Landlord
                        </button>

                        {canWithdraw && (
                            <button
                                onClick={handleWithdraw}
                                className="rounded-lg border border-red-500 px-6 py-3 font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                Withdraw Application
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </TenantLayout>
    );
}
