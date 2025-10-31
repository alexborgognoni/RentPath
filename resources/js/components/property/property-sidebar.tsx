import type { Property } from '@/types/dashboard';
import { router } from '@inertiajs/react';
import {
    Copy,
    Edit,
    FileText,
    Settings,
    Share,
    Trash2,
    Users
} from 'lucide-react';
import { useState } from 'react';

interface PropertySidebarProps {
    property: Property;
    tenantCount: number;
}

export function PropertySidebar({ property, tenantCount }: PropertySidebarProps) {
    const formatCurrency = (amount: number, currency: string) => {
        const currencyMap: Record<string, string> = {
            'eur': 'EUR',
            'usd': 'USD',
            'gbp': 'GBP',
            'chf': 'CHF',
        };

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyMap[currency] || 'EUR',
        }).format(amount);
    };

    const handleEdit = () => {
        router.visit(`/properties/${property.id}/edit`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            router.delete(`/properties/${property.id}`, {
                onSuccess: () => {
                    router.visit('/dashboard');
                },
            });
        }
    };

    const getStatusBadge = () => {
        const statusConfig: Record<string, { label: string; className: string }> = {
            inactive: {
                label: 'Inactive',
                className: 'bg-muted/50 text-muted-foreground',
            },
            available: {
                label: 'Available',
                className: 'bg-success/10 text-success',
            },
            application_received: {
                label: 'Applications',
                className: 'bg-blue-500/10 text-blue-400',
            },
            under_review: {
                label: 'Under Review',
                className: 'bg-amber-500/10 text-amber-400',
            },
            visit_scheduled: {
                label: 'Visit Scheduled',
                className: 'bg-purple-500/10 text-purple-400',
            },
            approved: {
                label: 'Approved',
                className: 'bg-emerald-500/10 text-emerald-400',
            },
            leased: {
                label: 'Leased',
                className: 'bg-cyan-500/10 text-cyan-400',
            },
            maintenance: {
                label: 'Maintenance',
                className: 'bg-orange-500/10 text-orange-400',
            },
            archived: {
                label: 'Archived',
                className: 'bg-muted/50 text-muted-foreground',
            },
        };

        const config = statusConfig[property.status] || statusConfig.inactive;

        return (
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                    <FileText className="mr-2 text-primary" size={20} />
                    Quick Stats
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Monthly Rent</span>
                        <span className="font-semibold text-foreground">
                            {formatCurrency(property.rent_amount, property.rent_currency)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Applications</span>
                        <span className="flex items-center font-semibold text-foreground">
                            <Users className="mr-1" size={16} />
                            {tenantCount}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        {getStatusBadge()}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                    <Settings className="mr-2 text-primary" size={20} />
                    Actions
                </h3>

                <div className="space-y-3">
                    <button
                        onClick={handleEdit}
                        className="flex w-full items-center rounded-lg border border-border bg-background/50 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-background hover:scale-105 cursor-pointer"
                    >
                        <Edit className="mr-3" size={16} />
                        Edit Property
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-destructive/20 bg-card p-6 shadow-sm">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-destructive">
                    <Trash2 className="mr-2" size={20} />
                    Danger Zone
                </h3>

                <p className="mb-4 text-sm text-muted-foreground">
                    Deleting this property will permanently remove all associated data.
                </p>

                <button
                    onClick={handleDelete}
                    className="flex w-full items-center justify-center rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive transition-all hover:bg-destructive/20 cursor-pointer"
                >
                    <Trash2 className="mr-2" size={16} />
                    Delete Property
                </button>
            </div>
        </div>
    );
}
