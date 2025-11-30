import { AppLayout } from '@/layouts/app-layout';
import type { Property } from '@/types/dashboard';
import { route } from '@/utils/route';
import { Head, Link } from '@inertiajs/react';
import { Bath, BedDouble, Home, MapPin, Maximize } from 'lucide-react';

interface PropertiesPageProps {
    properties: Property[];
}

export default function PropertiesPage({ properties }: PropertiesPageProps) {
    return (
        <AppLayout>
            <Head title="Browse Properties" />

            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-foreground">Browse Properties</h1>
                    <p className="text-muted-foreground">Discover available rental properties</p>
                </div>

                {properties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
                        <Home className="mb-4 h-16 w-16 text-muted-foreground opacity-50" />
                        <h2 className="mb-2 text-xl font-semibold text-foreground">No Properties Available</h2>
                        <p className="max-w-md text-muted-foreground">
                            There are currently no publicly available properties. Check back soon for new listings!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {properties.map((property) => {
                            const mainImage = property.images?.find((img) => img.is_main) || property.images?.[0];

                            return (
                                <Link
                                    key={property.id}
                                    href={route('tenant.properties.show', { property: property.id })}
                                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
                                >
                                    {/* Property Image */}
                                    <div className="relative aspect-video overflow-hidden bg-muted">
                                        {mainImage ? (
                                            <img
                                                src={mainImage.image_url}
                                                alt={property.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Home className="h-16 w-16 text-muted-foreground opacity-30" />
                                            </div>
                                        )}

                                        {/* Property Type Badge */}
                                        {property.type && (
                                            <div className="absolute top-3 left-3">
                                                <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
                                                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Property Details */}
                                    <div className="p-5">
                                        <div className="mb-3">
                                            <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-foreground">{property.title}</h3>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                                <span className="line-clamp-1">
                                                    {property.city}
                                                    {property.state && `, ${property.state}`}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Property Features */}
                                        <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                                            {property.bedrooms && (
                                                <div className="flex items-center gap-1">
                                                    <BedDouble className="h-4 w-4" />
                                                    <span>{property.bedrooms}</span>
                                                </div>
                                            )}
                                            {property.bathrooms && (
                                                <div className="flex items-center gap-1">
                                                    <Bath className="h-4 w-4" />
                                                    <span>{property.bathrooms}</span>
                                                </div>
                                            )}
                                            {property.size_sqm && (
                                                <div className="flex items-center gap-1">
                                                    <Maximize className="h-4 w-4" />
                                                    <span>{property.size_sqm}m²</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Price and CTA */}
                                        <div className="flex items-center justify-between border-t border-border pt-4">
                                            <div>
                                                <div className="text-2xl font-bold text-foreground">{property.formatted_rent}</div>
                                                <div className="text-xs text-muted-foreground">per month</div>
                                            </div>
                                            <span className="text-sm font-medium text-primary">View Details →</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
