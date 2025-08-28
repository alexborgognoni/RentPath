import type { Property } from '@/types/dashboard';
import { motion } from 'framer-motion';
import { Bath, Bed, Calendar, FileText, Grid2X2, Home, Maximize, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PropertyInfoProps {
    property: Property & {
        description?: string;
        available_date?: string;
        property_type?: string;
        charges_amount?: number;
        state?: string;
        zip_code?: string;
    };
}

export function PropertyInfo({ property }: PropertyInfoProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // Add escape key listener for fullscreen mode
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };

        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscape);
            return () => {
                document.body.style.overflow = 'unset';
                document.removeEventListener('keydown', handleEscape);
            };
        }
    }, [isFullscreen]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    const totalRent = property.rent_amount + (property.charges_amount || 0);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            {/* Hero Image */}
            {property.apartment_image && (
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                    <img
                        src={property.apartment_image}
                        alt={property.title}
                        className="h-[480px] w-full object-cover"
                    />
                    <button
                        onClick={toggleFullscreen}
                        className="absolute bottom-4 right-4 rounded-lg bg-background/80 p-2 text-foreground backdrop-blur-sm transition-all hover:scale-105 hover:bg-background/90"
                        title={isFullscreen ? 'Close fullscreen' : 'View fullscreen'}
                    >
                        {isFullscreen ? <X size={20} /> : <Maximize size={20} />}
                    </button>
                </div>
            )}

            {/* Property Header */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="mb-2 text-3xl font-bold text-foreground">
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                {property.title}
                            </span>
                        </h1>
                        <p className="text-muted-foreground">
                            {property.address}
                            {property.city && `, ${property.city}`}
                            {property.state && `, ${property.state}`}
                            {property.zip_code && ` ${property.zip_code}`}
                        </p>
                    </div>

                    {/* Rent Price Box */}
                    <div className="ml-6 rounded-xl border border-success/30 bg-success/10 p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-success">
                                {formatCurrency(totalRent)}
                            </div>
                            <div className="text-xs font-medium text-success/80">
                                per month
                            </div>
                        </div>
                    </div>
                </div>

                {/* Property Facts Grid */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div className="rounded-lg border border-border bg-background/50 p-3 transition-all hover:bg-background/80">
                        <div className="flex items-center space-x-3">
                            <Home size={18} className="text-primary" />
                            <div className="min-w-0 flex-1 text-center">
                                <p className="mb-1 text-sm font-bold text-foreground capitalize">
                                    {property.property_type || 'N/A'}
                                </p>
                                <p className="text-xs text-muted-foreground">Type</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-background/50 p-3 transition-all hover:bg-background/80">
                        <div className="flex items-center space-x-3">
                            <Bed size={18} className="text-primary" />
                            <div className="min-w-0 flex-1 text-center">
                                <p className="mb-1 text-sm font-bold text-foreground">
                                    {property.bedrooms || 'N/A'}
                                </p>
                                <p className="text-xs text-muted-foreground">Bedrooms</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-background/50 p-3 transition-all hover:bg-background/80">
                        <div className="flex items-center space-x-3">
                            <Bath size={18} className="text-primary" />
                            <div className="min-w-0 flex-1 text-center">
                                <p className="mb-1 text-sm font-bold text-foreground">
                                    {property.bathrooms || 'N/A'}
                                </p>
                                <p className="text-xs text-muted-foreground">Bathrooms</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-background/50 p-3 transition-all hover:bg-background/80">
                        <div className="flex items-center space-x-3">
                            <Grid2X2 size={18} className="text-primary" />
                            <div className="min-w-0 flex-1 text-center">
                                <p className="mb-1 text-sm font-bold text-foreground">
                                    {property.square_meters ? `${property.square_meters} m²` : 'N/A'}
                                </p>
                                <p className="text-xs text-muted-foreground">Size</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-background/50 p-3 transition-all hover:bg-background/80">
                        <div className="flex items-center space-x-3">
                            <Calendar size={18} className="text-primary" />
                            <div className="min-w-0 flex-1 text-center">
                                <p className="mb-1 text-sm font-bold text-foreground">
                                    {property.available_date
                                        ? new Date(property.available_date).toLocaleDateString('nl-NL')
                                        : 'N/A'}
                                </p>
                                <p className="text-xs text-muted-foreground">Available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            {property.description && (
                <div className="rounded-2xl border border-border bg-card shadow-sm">
                    {/* Description Header */}
                    <div className="border-b border-border p-6">
                        <h2 className="flex items-center text-xl font-bold text-foreground">
                            <FileText className="mr-3 text-primary" size={24} />
                            Description
                        </h2>
                    </div>

                    {/* Description Content */}
                    <div className="p-6">
                        <div className="prose prose-neutral max-w-none dark:prose-invert">
                            <div 
                                className="text-muted-foreground leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: property.description
                                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                                        .replace(/\*(.*?)\*/g, '<em class="text-foreground/90 italic">$1</em>')
                                        .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold text-foreground mb-4">$1</h1>')
                                        .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold text-foreground mb-3">$2</h2>')
                                        .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold text-foreground mb-2">$3</h3>')
                                        .replace(/^- (.*)$/gm, '<li class="text-muted-foreground text-sm">$1</li>')
                                        .replace(/(<li.*<\/li>)/gs, '<ul class="space-y-2 ml-6 mb-4 list-disc text-sm">$1</ul>')
                                        .replace(/\n\n/g, '</p><p class="text-muted-foreground leading-relaxed mb-4 text-sm">')
                                        .replace(/^(?!<[h|u|l])/gm, '<p class="text-muted-foreground leading-relaxed mb-4 text-sm">')
                                        .replace(/(?<!>)$/gm, '</p>')
                                        .replace(/<p class="[^"]*"><\/p>/g, '')
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Modal */}
            {isFullscreen && property.apartment_image && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-background/95 backdrop-blur-md"
                    onClick={toggleFullscreen}
                >
                    <div className="relative flex h-full w-full items-center justify-center">
                        <img
                            src={property.apartment_image}
                            alt={property.title}
                            className="max-h-full max-w-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={toggleFullscreen}
                            className="absolute right-4 top-4 z-[100000] rounded-lg bg-background/80 p-3 text-foreground backdrop-blur-sm transition-all hover:scale-105 hover:bg-background/90"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}