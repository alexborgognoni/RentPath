import type { Property } from '@/types/dashboard';
import { motion } from 'framer-motion';
import { 
    Calendar, 
    Copy, 
    Edit, 
    ExternalLink, 
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
    const [copied, setCopied] = useState(false);

    const handleCopyInviteLink = async () => {
        const inviteLink = `${window.location.origin}/tenant/apply/${property.invite_token}`;
        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const handleShare = async () => {
        const inviteLink = `${window.location.origin}/tenant/apply/${property.invite_token}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Apply for ${property.title}`,
                    text: `Check out this property: ${property.title}`,
                    url: inviteLink,
                });
            } catch (err) {
                console.error('Failed to share:', err);
                // Fallback to copy
                handleCopyInviteLink();
            }
        } else {
            handleCopyInviteLink();
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
                <h3 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                    <FileText className="mr-2 text-primary" size={20} />
                    Quick Stats
                </h3>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Monthly Rent</span>
                        <span className="font-semibold text-foreground">
                            {formatCurrency(property.rent_amount)}
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
                        <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                            Active
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
                <h3 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                    <Settings className="mr-2 text-primary" size={20} />
                    Actions
                </h3>
                
                <div className="space-y-3">
                    <button className="flex w-full items-center rounded-lg border border-border bg-background/50 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-background hover:scale-105 cursor-pointer">
                        <Edit className="mr-3" size={16} />
                        Edit Property
                    </button>
                    
                    <button 
                        onClick={handleCopyInviteLink}
                        className="flex w-full items-center rounded-lg border border-border bg-background/50 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-background hover:scale-105 cursor-pointer"
                    >
                        <Copy className="mr-3" size={16} />
                        {copied ? 'Copied!' : 'Copy Invite Link'}
                    </button>
                    
                    <button 
                        onClick={handleShare}
                        className="flex w-full items-center rounded-lg border border-border bg-background/50 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-background hover:scale-105 cursor-pointer"
                    >
                        <Share className="mr-3" size={16} />
                        Share Property
                    </button>
                </div>
            </motion.div>

            {/* Property Management */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
                <h3 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                    <Calendar className="mr-2 text-primary" size={20} />
                    Management
                </h3>
                
                <div className="space-y-3">
                    <button className="flex w-full items-center rounded-lg border border-border bg-background/50 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-background hover:scale-105 cursor-pointer">
                        <FileText className="mr-3" size={16} />
                        Schedule Inspection
                    </button>
                    
                    <button className="flex w-full items-center rounded-lg border border-border bg-background/50 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-background hover:scale-105 cursor-pointer">
                        <Calendar className="mr-3" size={16} />
                        Inspection History
                    </button>
                    
                    <a 
                        href={`/tenant/apply/${property.invite_token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center rounded-lg border border-border bg-background/50 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-background hover:scale-105 cursor-pointer"
                    >
                        <ExternalLink className="mr-3" size={16} />
                        View Tenant Portal
                    </a>
                </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="rounded-2xl border border-destructive/20 bg-card p-6 shadow-sm"
            >
                <h3 className="mb-4 flex items-center text-lg font-semibold text-destructive">
                    <Trash2 className="mr-2" size={20} />
                    Danger Zone
                </h3>
                
                <p className="mb-4 text-sm text-muted-foreground">
                    Deleting this property will permanently remove all associated data, including tenant applications and history.
                </p>
                
                <button className="flex w-full items-center justify-center rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive transition-all hover:bg-destructive/20 cursor-pointer">
                    <Trash2 className="mr-2" size={16} />
                    Delete Property
                </button>
            </motion.div>
        </div>
    );
}