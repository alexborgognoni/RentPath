import type { TenantApplication } from '@/types/dashboard';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Clock,
    Download,
    FileText,
    Mail,
    MessageSquare,
    Phone,
    User,
    X, 
    XCircle 
} from 'lucide-react';
import { useState } from 'react';

interface TenantDetailsModalProps {
    tenant: TenantApplication;
    onClose: () => void;
    onUpdateStatus: (tenantId: number, status: string, notes?: string) => Promise<void>;
}

export function TenantDetailsModal({ tenant, onClose, onUpdateStatus }: TenantDetailsModalProps) {
    const [notes, setNotes] = useState(tenant.notes || '');
    const [updating, setUpdating] = useState(false);

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(true);
        try {
            await onUpdateStatus(tenant.id, newStatus, notes);
        } finally {
            setUpdating(false);
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
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'text-success';
            case 'rejected':
                return 'text-destructive';
            case 'under_review':
                return 'text-warning';
            default:
                return 'text-muted-foreground';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle size={20} />;
            case 'rejected':
                return <XCircle size={20} />;
            case 'under_review':
                return <Clock size={20} />;
            default:
                return <Clock size={20} />;
        }
    };

    const documentTypes = {
        id: 'Identity Document',
        income: 'Income Verification',
        employment: 'Employment Letter',
        references: 'References'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 border-b border-border bg-card/95 p-6 backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">{tenant.applicant_name}</h2>
                                <div className="mt-1 flex items-center space-x-4">
                                    <span className="flex items-center text-sm text-muted-foreground">
                                        <Mail size={14} className="mr-1" />
                                        {tenant.applicant_email}
                                    </span>
                                    <span className="flex items-center text-sm text-muted-foreground">
                                        <Phone size={14} className="mr-1" />
                                        {tenant.applicant_phone}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className={`flex items-center space-x-2 ${getStatusColor(tenant.application_status)}`}>
                                {getStatusIcon(tenant.application_status)}
                                <span className="font-semibold capitalize">
                                    {tenant.application_status.replace('_', ' ')}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Application Progress */}
                    <div className="mb-8 rounded-xl border border-border bg-background/50 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-foreground">Application Progress</h3>
                        <div className="flex items-center space-x-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-white">
                                <CheckCircle size={16} />
                            </div>
                            <div className="h-2 flex-1 rounded-full bg-success"></div>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${tenant.application_status !== 'pending' ? 'bg-success text-white' : 'bg-muted text-muted-foreground'}`}>
                                <Clock size={16} />
                            </div>
                            <div className={`h-2 flex-1 rounded-full ${tenant.application_status === 'approved' ? 'bg-success' : 'bg-muted'}`}></div>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${tenant.application_status === 'approved' ? 'bg-success text-white' : 'bg-muted text-muted-foreground'}`}>
                                <CheckCircle size={16} />
                            </div>
                        </div>
                        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                            <span>Applied</span>
                            <span>Under Review</span>
                            <span>Decision</span>
                        </div>
                    </div>

                    {/* Application Details */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Personal Information */}
                        <div className="rounded-xl border border-border bg-background/50 p-6">
                            <h3 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                                <User className="mr-2 text-primary" size={20} />
                                Personal Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Monthly Income</label>
                                    <p className="text-lg font-semibold text-success">
                                        {formatCurrency(tenant.monthly_income)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Employment Status</label>
                                    <p className="font-medium text-foreground">{tenant.employment_status}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Employer</label>
                                    <p className="font-medium text-foreground">{tenant.employer}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Preferred Move-in Date</label>
                                    <p className="font-medium text-foreground">{formatDate(tenant.move_in_date)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Application Information */}
                        <div className="rounded-xl border border-border bg-background/50 p-6">
                            <h3 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                                <FileText className="mr-2 text-primary" size={20} />
                                Application Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Application Date</label>
                                    <p className="font-medium text-foreground">{formatDate(tenant.created_at)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                    <p className="font-medium text-foreground">{formatDate(tenant.updated_at)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Documents Uploaded</label>
                                    <div className="mt-2 space-y-2">
                                        {tenant.documents_uploaded.map((docType) => (
                                            <div key={docType} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
                                                <div className="flex items-center space-x-2">
                                                    <FileText size={16} className="text-primary" />
                                                    <span className="text-sm font-medium text-foreground">
                                                        {documentTypes[docType as keyof typeof documentTypes] || docType}
                                                    </span>
                                                </div>
                                                <button className="text-primary hover:text-primary/80">
                                                    <Download size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="mb-8 rounded-xl border border-border bg-background/50 p-6">
                        <h3 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                            <MessageSquare className="mr-2 text-primary" size={20} />
                            Notes & Comments
                        </h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes about this application..."
                            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            rows={4}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                        {tenant.application_status === 'pending' && (
                            <>
                                <button
                                    onClick={() => handleStatusUpdate('approved')}
                                    disabled={updating}
                                    className="flex items-center rounded-xl bg-success px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <CheckCircle className="mr-2" size={16} />
                                    {updating ? 'Updating...' : 'Approve Application'}
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('under_review')}
                                    disabled={updating}
                                    className="flex items-center rounded-xl bg-warning px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <Clock className="mr-2" size={16} />
                                    {updating ? 'Updating...' : 'Mark Under Review'}
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('rejected')}
                                    disabled={updating}
                                    className="flex items-center rounded-xl bg-destructive px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <XCircle className="mr-2" size={16} />
                                    {updating ? 'Updating...' : 'Reject Application'}
                                </button>
                            </>
                        )}
                        
                        {tenant.application_status === 'under_review' && (
                            <>
                                <button
                                    onClick={() => handleStatusUpdate('approved')}
                                    disabled={updating}
                                    className="flex items-center rounded-xl bg-success px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <CheckCircle className="mr-2" size={16} />
                                    {updating ? 'Updating...' : 'Approve Application'}
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('rejected')}
                                    disabled={updating}
                                    className="flex items-center rounded-xl bg-destructive px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <XCircle className="mr-2" size={16} />
                                    {updating ? 'Updating...' : 'Reject Application'}
                                </button>
                            </>
                        )}

                        {(tenant.application_status === 'approved' || tenant.application_status === 'rejected') && (
                            <button
                                onClick={() => handleStatusUpdate('pending')}
                                disabled={updating}
                                className="flex items-center rounded-xl border border-border bg-background px-6 py-3 font-medium text-foreground shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <Clock className="mr-2" size={16} />
                                {updating ? 'Updating...' : 'Reset to Pending'}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}