import type { TenantApplication } from '@/types/dashboard';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, DollarSign, FileText, Mail, Phone, User, Users, XCircle } from 'lucide-react';

interface TenantApplicationsTableProps {
    tenantApplications: TenantApplication[];
    onTenantSelect: (tenant: TenantApplication) => void;
}

export function TenantApplicationsTable({ tenantApplications, onTenantSelect }: TenantApplicationsTableProps) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="text-success" size={20} />;
            case 'rejected':
                return <XCircle className="text-destructive" size={20} />;
            case 'under_review':
                return <Clock className="text-warning" size={20} />;
            default:
                return <Clock className="text-muted-foreground" size={20} />;
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
        switch (status) {
            case 'approved':
                return `${baseClasses} bg-success/10 text-success`;
            case 'rejected':
                return `${baseClasses} bg-destructive/10 text-destructive`;
            case 'under_review':
                return `${baseClasses} bg-warning/10 text-warning`;
            default:
                return `${baseClasses} bg-muted text-muted-foreground`;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('nl-NL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (tenantApplications.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
            >
                <Users className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h3 className="mb-2 text-lg font-semibold text-foreground">No Applications Yet</h3>
                <p className="text-muted-foreground">Share the property invite link to start receiving tenant applications.</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-border bg-card shadow-sm"
        >
            {/* Header */}
            <div className="border-b border-border p-6">
                <h2 className="flex items-center text-xl font-bold text-foreground">
                    <Users className="mr-3 text-primary" size={24} />
                    Tenant Applications ({tenantApplications.length})
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Review and manage tenant applications for this property</p>
            </div>

            {/* Applications List */}
            <div className="divide-y divide-border">
                {tenantApplications.map((tenant, index) => (
                    <motion.div
                        key={tenant.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="cursor-pointer p-6 transition-colors hover:bg-muted/50"
                        onClick={() => onTenantSelect(tenant)}
                    >
                        <div className="flex items-start space-x-4">
                            {/* Avatar */}
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
                                <User size={20} />
                            </div>

                            {/* Main Content */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-base font-semibold text-foreground">{tenant.applicant_name}</h3>
                                        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center">
                                                <Mail size={14} className="mr-1" />
                                                {tenant.applicant_email}
                                            </div>
                                            <div className="flex items-center">
                                                <Phone size={14} className="mr-1" />
                                                {tenant.applicant_phone}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(tenant.application_status)}
                                        <span className={getStatusBadge(tenant.application_status)}>
                                            {tenant.application_status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <div className="flex items-center text-sm">
                                        <DollarSign size={14} className="text-success mr-2" />
                                        <div>
                                            <p className="text-muted-foreground">Income</p>
                                            <p className="font-medium text-foreground">{formatCurrency(tenant.monthly_income)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <User size={14} className="mr-2 text-primary" />
                                        <div>
                                            <p className="text-muted-foreground">Employment</p>
                                            <p className="font-medium text-foreground">{tenant.employment_status}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <Calendar size={14} className="mr-2 text-secondary" />
                                        <div>
                                            <p className="text-muted-foreground">Move-in</p>
                                            <p className="font-medium text-foreground">{formatDate(tenant.move_in_date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <FileText size={14} className="mr-2 text-muted-foreground" />
                                        <div>
                                            <p className="text-muted-foreground">Documents</p>
                                            <p className="font-medium text-foreground">{tenant.documents_uploaded.length} files</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes Preview */}
                                {tenant.notes && (
                                    <div className="mt-3 rounded-md bg-muted/50 p-3">
                                        <p className="text-sm text-muted-foreground">
                                            <FileText size={12} className="mr-1 inline" />
                                            {tenant.notes.length > 100 ? `${tenant.notes.substring(0, 100)}...` : tenant.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Application Date */}
                                <div className="mt-3 text-xs text-muted-foreground">
                                    Applied on {formatDate(tenant.created_at)}
                                    {tenant.updated_at !== tenant.created_at && <span> • Last updated {formatDate(tenant.updated_at)}</span>}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
