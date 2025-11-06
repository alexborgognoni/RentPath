import type { Property } from '@/types/dashboard';
import {
    Bath,
    Bed,
    Building,
    Calendar,
    Camera,
    Car,
    FileText,
    Flame,
    Grid2X2,
    Home,
    Maximize,
    Trees,
    UtensilsCrossed,
    Warehouse,
    Wind,
    X,
    Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface PropertyInfoProps {
    property: Property;
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

    const formatCurrency = (amount: number, currency: string) => {
        const currencyMap: Record<string, string> = {
            eur: 'EUR',
            usd: 'USD',
            gbp: 'GBP',
            chf: 'CHF',
        };

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyMap[currency] || 'EUR',
        }).format(amount);
    };

    // Get main image or first image
    const mainImage = property.images?.find((img) => img.is_main) || property.images?.[0];

    return (
        <div className="space-y-8">
            {/* Hero Image */}
            {mainImage && (
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                    <img src={mainImage.image_url || ''} alt={property.title} className="h-[480px] w-full object-cover" />
                    <button
                        onClick={toggleFullscreen}
                        className="absolute right-4 bottom-4 rounded-lg bg-background/80 p-2 text-foreground backdrop-blur-sm transition-all hover:scale-105 hover:bg-background/90"
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
                        <h1 className="mb-2 text-3xl font-bold text-foreground">{property.title}</h1>
                        <p className="text-muted-foreground">
                            {property.house_number} {property.street_name}
                            {property.street_line2 && `, ${property.street_line2}`}, {property.city} {property.postal_code}
                        </p>
                    </div>

                    {/* Rent Price Box */}
                    <div className="border-success/30 bg-success/10 ml-6 rounded-xl border p-4">
                        <div className="text-center">
                            <div className="text-success text-2xl font-bold">{formatCurrency(property.rent_amount, property.rent_currency)}</div>
                            <div className="text-success/80 text-xs font-medium">per month</div>
                        </div>
                    </div>
                </div>

                {/* Property Facts Grid */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div className="rounded-lg border border-border bg-background/50 p-3 transition-all hover:bg-background/80">
                        <div className="flex items-center space-x-3">
                            <Home size={18} className="text-primary" />
                            <div className="min-w-0 flex-1 text-center">
                                <p className="mb-1 text-sm font-bold text-foreground capitalize">{property.type || 'N/A'}</p>
                                <p className="text-xs text-muted-foreground">Type</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-background/50 p-3 transition-all hover:bg-background/80">
                        <div className="flex items-center space-x-3">
                            <Bed size={18} className="text-primary" />
                            <div className="min-w-0 flex-1 text-center">
                                <p className="mb-1 text-sm font-bold text-foreground">{property.bedrooms || 0}</p>
                                <p className="text-xs text-muted-foreground">Bedrooms</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-background/50 p-3 transition-all hover:bg-background/80">
                        <div className="flex items-center space-x-3">
                            <Bath size={18} className="text-primary" />
                            <div className="min-w-0 flex-1 text-center">
                                <p className="mb-1 text-sm font-bold text-foreground">{property.bathrooms || 0}</p>
                                <p className="text-xs text-muted-foreground">Bathrooms</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-background/50 p-3 transition-all hover:bg-background/80">
                        <div className="flex items-center space-x-3">
                            <Grid2X2 size={18} className="text-primary" />
                            <div className="min-w-0 flex-1 text-center">
                                <p className="mb-1 text-sm font-bold text-foreground">{property.size ? `${property.size} m²` : 'N/A'}</p>
                                <p className="text-xs text-muted-foreground">Size</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-background/50 p-3 transition-all hover:bg-background/80">
                        <div className="flex items-center space-x-3">
                            <Calendar size={18} className="text-primary" />
                            <div className="min-w-0 flex-1 text-center">
                                <p className="mb-1 text-sm font-bold text-foreground">
                                    {property.available_date ? new Date(property.available_date).toLocaleDateString('en-US') : 'N/A'}
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
                    <div className="border-b border-border p-6">
                        <h2 className="flex items-center text-xl font-bold text-foreground">
                            <FileText className="mr-3 text-primary" size={24} />
                            Description
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">{property.description}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Additional Details */}
            <div className="rounded-2xl border border-border bg-card shadow-sm">
                <div className="border-b border-border p-6">
                    <h2 className="flex items-center text-xl font-bold text-foreground">
                        <Building className="mr-3 text-primary" size={24} />
                        Property Details
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                    {/* Parking */}
                    {(property.parking_spots_interior > 0 || property.parking_spots_exterior > 0) && (
                        <div className="flex items-start space-x-3">
                            <Car size={18} className="mt-1 text-primary" />
                            <div>
                                <p className="text-sm font-semibold text-foreground">Parking</p>
                                <p className="text-sm text-muted-foreground">
                                    {property.parking_spots_interior > 0 && `${property.parking_spots_interior} Indoor`}
                                    {property.parking_spots_interior > 0 && property.parking_spots_exterior > 0 && ', '}
                                    {property.parking_spots_exterior > 0 && `${property.parking_spots_exterior} Outdoor`}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Balcony */}
                    {property.balcony_size && (
                        <div className="flex items-start space-x-3">
                            <Grid2X2 size={18} className="mt-1 text-primary" />
                            <div>
                                <p className="text-sm font-semibold text-foreground">Balcony</p>
                                <p className="text-sm text-muted-foreground">{property.balcony_size} m²</p>
                            </div>
                        </div>
                    )}

                    {/* Land Size */}
                    {property.land_size && (
                        <div className="flex items-start space-x-3">
                            <Trees size={18} className="mt-1 text-primary" />
                            <div>
                                <p className="text-sm font-semibold text-foreground">Land Size</p>
                                <p className="text-sm text-muted-foreground">{property.land_size} m²</p>
                            </div>
                        </div>
                    )}

                    {/* Floor Level */}
                    {property.floor_level !== null && property.floor_level !== undefined && (
                        <div className="flex items-start space-x-3">
                            <Building size={18} className="mt-1 text-primary" />
                            <div>
                                <p className="text-sm font-semibold text-foreground">Floor</p>
                                <p className="text-sm text-muted-foreground">
                                    Level {property.floor_level}
                                    {property.has_elevator && ' (Elevator available)'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Year Built */}
                    {property.year_built && (
                        <div className="flex items-start space-x-3">
                            <Calendar size={18} className="mt-1 text-primary" />
                            <div>
                                <p className="text-sm font-semibold text-foreground">Year Built</p>
                                <p className="text-sm text-muted-foreground">{property.year_built}</p>
                            </div>
                        </div>
                    )}

                    {/* Energy Class */}
                    {property.energy_class && (
                        <div className="flex items-start space-x-3">
                            <Zap size={18} className="mt-1 text-primary" />
                            <div>
                                <p className="text-sm font-semibold text-foreground">Energy Class</p>
                                <p className="text-sm text-muted-foreground">{property.energy_class}</p>
                            </div>
                        </div>
                    )}

                    {/* Thermal Insulation */}
                    {property.thermal_insulation_class && (
                        <div className="flex items-start space-x-3">
                            <Wind size={18} className="mt-1 text-primary" />
                            <div>
                                <p className="text-sm font-semibold text-foreground">Thermal Insulation</p>
                                <p className="text-sm text-muted-foreground">Class {property.thermal_insulation_class}</p>
                            </div>
                        </div>
                    )}

                    {/* Heating Type */}
                    {property.heating_type && (
                        <div className="flex items-start space-x-3">
                            <Flame size={18} className="mt-1 text-primary" />
                            <div>
                                <p className="text-sm font-semibold text-foreground">Heating</p>
                                <p className="text-sm text-muted-foreground capitalize">{property.heating_type.replace('_', ' ')}</p>
                            </div>
                        </div>
                    )}

                    {/* Kitchen */}
                    {(property.kitchen_equipped || property.kitchen_separated) && (
                        <div className="flex items-start space-x-3">
                            <UtensilsCrossed size={18} className="mt-1 text-primary" />
                            <div>
                                <p className="text-sm font-semibold text-foreground">Kitchen</p>
                                <p className="text-sm text-muted-foreground">
                                    {property.kitchen_equipped && 'Equipped'}
                                    {property.kitchen_equipped && property.kitchen_separated && ', '}
                                    {property.kitchen_separated && 'Separated'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Amenities */}
            {(property.has_cellar ||
                property.has_laundry ||
                property.has_fireplace ||
                property.has_air_conditioning ||
                property.has_garden ||
                property.has_rooftop) && (
                <div className="rounded-2xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border p-6">
                        <h2 className="flex items-center text-xl font-bold text-foreground">
                            <Warehouse className="mr-3 text-primary" size={24} />
                            Amenities
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {property.has_cellar && (
                                <div className="flex items-center space-x-2">
                                    <div className="bg-success h-2 w-2 rounded-full"></div>
                                    <span className="text-sm text-foreground">Cellar</span>
                                </div>
                            )}
                            {property.has_laundry && (
                                <div className="flex items-center space-x-2">
                                    <div className="bg-success h-2 w-2 rounded-full"></div>
                                    <span className="text-sm text-foreground">Laundry</span>
                                </div>
                            )}
                            {property.has_fireplace && (
                                <div className="flex items-center space-x-2">
                                    <div className="bg-success h-2 w-2 rounded-full"></div>
                                    <span className="text-sm text-foreground">Fireplace</span>
                                </div>
                            )}
                            {property.has_air_conditioning && (
                                <div className="flex items-center space-x-2">
                                    <div className="bg-success h-2 w-2 rounded-full"></div>
                                    <span className="text-sm text-foreground">Air Conditioning</span>
                                </div>
                            )}
                            {property.has_garden && (
                                <div className="flex items-center space-x-2">
                                    <div className="bg-success h-2 w-2 rounded-full"></div>
                                    <span className="text-sm text-foreground">Garden</span>
                                </div>
                            )}
                            {property.has_rooftop && (
                                <div className="flex items-center space-x-2">
                                    <div className="bg-success h-2 w-2 rounded-full"></div>
                                    <span className="text-sm text-foreground">Rooftop Access</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Property Images Gallery */}
            {property.images && property.images.length > 0 && (
                <div className="rounded-2xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border p-6">
                        <h2 className="flex items-center text-xl font-bold text-foreground">
                            <Camera className="mr-3 text-primary" size={24} />
                            Property Images
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {property.images.map((image, index) => (
                                <div
                                    key={image.id}
                                    className="group relative cursor-pointer overflow-hidden rounded-lg"
                                    onClick={() => {
                                        setIsFullscreen(true);
                                        // Could add logic to show specific image in fullscreen
                                    }}
                                >
                                    <img
                                        src={image.image_url || ''}
                                        alt={`${property.title} - Image ${index + 1}`}
                                        className="h-64 w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    {image.is_main && (
                                        <div className="absolute top-2 left-2 rounded bg-primary px-2 py-1 text-xs font-medium text-white">
                                            Main Image
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/0 transition-colors group-hover:bg-background/10">
                                        <Maximize size={32} className="text-white opacity-0 transition-opacity group-hover:opacity-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Modal */}
            {isFullscreen && mainImage && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-background/95 backdrop-blur-md"
                    onClick={toggleFullscreen}
                >
                    <div className="relative flex h-full w-full items-center justify-center">
                        <img
                            src={mainImage.image_url || ''}
                            alt={property.title}
                            className="max-h-full max-w-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={toggleFullscreen}
                            className="absolute top-4 right-4 z-[100000] rounded-lg bg-background/80 p-3 text-foreground backdrop-blur-sm transition-all hover:scale-105 hover:bg-background/90"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
