import { DashboardHeader } from '@/components/dashboard-header';
import { PropertyTypeIcon } from '@/components/property-type-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { OccupancyStatus, Property } from '@/types/property';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Bath,
    BedDouble,
    Calendar,
    Car,
    Cigarette,
    Dog,
    Edit3,
    Eye,
    Globe,
    Home,
    HousePlug,
    Image as ImageIcon,
    Key,
    MapPin,
    Ruler,
    Shield,
    Thermometer,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PageProps extends InertiaPageProps {
    property: Property;
}

const getOccupancyStatusBadgeVariant = (status: OccupancyStatus) => {
    switch (status) {
        case 'Occupied':
            return 'default';
        case 'Vacant':
            return 'secondary';
        case 'Under Maintenance':
            return 'destructive';
        default:
            return 'outline';
    }
};

const PropertyDetailsPage = () => {
    const { property } = usePage<PageProps>().props;
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [maxVisibleThumbs, setMaxVisibleThumbs] = useState(6);
    const thumbsContainerRef = useRef<HTMLDivElement>(null);
    const thumbWidth = 64; // 16 (w-16) * 4 = 64px
    const [api, setApi] = useState<any>();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Properties',
            href: '/dashboard/properties',
        },
        {
            title: property.address,
            href: `/dashboard/properties/${property.id}`,
        },
    ];

    const propertyFeatures = [
        { icon: <BedDouble className="h-4 w-4" />, label: `${property.bedrooms} Bed(s)` },
        { icon: <Bath className="h-4 w-4" />, label: `${property.bathrooms} Bath(s)` },
        { icon: <Ruler className="h-4 w-4" />, label: `${property.square_meters} m²` },
        { icon: <Car className="h-4 w-4" />, label: `${property.indoor_parking_spots} Indoor` },
        { icon: <Car className="h-4 w-4" />, label: `${property.outdoor_parking_spots} Outdoor` },
        ...(property.furnished ? [{ icon: <Home className="h-4 w-4" />, label: 'Furnished' }] : []),
        ...(property.pets_allowed ? [{ icon: <Dog className="h-4 w-4" />, label: 'Pets allowed' }] : []),
        ...(property.smoking_allowed ? [{ icon: <Cigarette className="h-4 w-4" />, label: 'Smoking allowed' }] : []),
        ...(property.heating_type ? [{ icon: <Thermometer className="h-4 w-4" />, label: property.heating_type }] : []),
        ...(property.energy_class ? [{ icon: <HousePlug className="h-4 w-4" />, label: `Energy class: ${property.energy_class}` }] : []),
    ];

    const images = [property.cover_image_url || '', ...property.photo_gallery];
    const extraImagesCount = images.length > maxVisibleThumbs ? images.length - maxVisibleThumbs : 0;

    const openFullscreen = (index: number) => {
        setCurrentImageIndex(index);
        setIsFullscreen(true);
    };

    const closeFullscreen = () => {
        setIsFullscreen(false);
    };

    useEffect(() => {
        const calculateVisibleThumbs = () => {
            if (thumbsContainerRef.current) {
                const containerWidth = thumbsContainerRef.current.offsetWidth;
                const gap = 8; // gap-2 = 8px
                const calculatedMax = Math.floor((containerWidth + gap) / (thumbWidth + gap));
                setMaxVisibleThumbs(Math.max(1, calculatedMax)); // Ensure at least 1 thumbnail is shown
            }
        };

        calculateVisibleThumbs();
        window.addEventListener('resize', calculateVisibleThumbs);
        return () => window.removeEventListener('resize', calculateVisibleThumbs);
    }, []);

    useEffect(() => {
        if (!api) return;

        api.on('select', () => {
            setCurrentImageIndex(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Property - ${property.address}`} />

            {/* Fullscreen Carousel Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
                    <button
                        onClick={closeFullscreen}
                        className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div className="relative mb-4 flex h-[80vh] w-full max-w-6xl items-center justify-center">
                        <Carousel
                            opts={{
                                startIndex: currentImageIndex,
                            }}
                            setApi={setApi}
                            className="h-full w-full"
                        >
                            <CarouselContent className="h-full">
                                {images.map((image, index) => (
                                    <CarouselItem key={index} className="flex h-full items-center justify-center">
                                        <div className="flex h-full w-full items-center justify-center">
                                            {' '}
                                            <img
                                                src={image}
                                                alt={`Property ${index + 1}`}
                                                className="h-full w-full object-contain"
                                                style={{
                                                    width: 'auto',
                                                    height: 'auto',
                                                    maxHeight: '100%',
                                                    maxWidth: '100%',
                                                    aspectRatio: '16/9',
                                                }}
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2 text-white hover:text-white/80" />
                            <CarouselNext className="right-2 text-white hover:text-white/80" />
                        </Carousel>
                    </div>

                    {/* Fullscreen Thumbnail Slider - Shows all images */}
                    <div className="w-full max-w-4xl">
                        <div className="flex flex-wrap justify-center gap-2">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 ${currentImageIndex === index ? 'border-white' : 'border-transparent'}`}
                                    onClick={() => {
                                        setCurrentImageIndex(index);
                                        api?.scrollTo(index);
                                    }}
                                >
                                    <img src={image} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-1 flex-col">
                <DashboardHeader title={property.title} />
                <div className="flex-1 space-y-6 p-4 sm:p-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Property images */}
                            <Card>
                                <CardHeader>
                                    <div>
                                        <CardTitle>Photos</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {property.photo_gallery && property.photo_gallery.length > 0 ? (
                                        <div className="relative">
                                            <Carousel>
                                                <CarouselContent>
                                                    {images.map((image, index) => (
                                                        <CarouselItem key={index}>
                                                            <div className="h-80 w-full cursor-pointer" onClick={() => openFullscreen(index)}>
                                                                <img
                                                                    src={image}
                                                                    alt={`Property ${index + 1}`}
                                                                    className="h-full w-full rounded-lg object-cover"
                                                                />
                                                            </div>
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                <CarouselPrevious className="left-2" />
                                                <CarouselNext className="right-2" />
                                            </Carousel>

                                            {/* Thumbnail Preview with +X count */}
                                            <div className="mt-4 flex flex-wrap gap-2" ref={thumbsContainerRef}>
                                                {images.slice(0, maxVisibleThumbs).map((image, index) => (
                                                    <div
                                                        key={index}
                                                        className={`relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-md ${index === maxVisibleThumbs - 1 && extraImagesCount > 0 ? 'opacity-70' : ''}`}
                                                        onClick={() => openFullscreen(index)}
                                                    >
                                                        <img src={image} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                                                        {index === maxVisibleThumbs - 1 && extraImagesCount > 0 && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 font-bold text-white">
                                                                +{extraImagesCount}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex h-60 items-center justify-center rounded-lg bg-muted">
                                            <div className="flex flex-col items-center text-muted-foreground">
                                                <ImageIcon className="h-10 w-10" />
                                                <p className="mt-2">No photos available</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Rest of your existing content remains exactly the same */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Details</CardTitle>
                                        <Badge variant={getOccupancyStatusBadgeVariant(property.occupancy_status)}>{property.occupancy_status}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-1">
                                            <p className="text-muted-foreground">{property.description}</p>
                                        </div>
                                        <div className="ml-7.5 text-right">
                                            <p className="text-2xl font-bold">${property.rent_amount.toLocaleString()}/mo</p>
                                            {property.security_deposit && (
                                                <p className="text-sm text-muted-foreground">${property.security_deposit.toLocaleString()} deposit</p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                        {propertyFeatures.map((feature, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                {feature.icon}
                                                <span className="text-sm">{feature.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h4 className="font-medium">Additional Information</h4>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="flex items-center space-x-2">
                                                <PropertyTypeIcon type={property.property_type} />
                                                <span>{property.property_type}</span>
                                            </div>
                                            {property.floor_number && (
                                                <div className="flex items-center space-x-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>
                                                        Floor {property.floor_number}
                                                        {property.total_floors && ` of ${property.total_floors} `}
                                                    </span>
                                                </div>
                                            )}
                                            {property.year_built && (
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Built in {property.year_built}</span>
                                                </div>
                                            )}
                                            {property.available_from && (
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Available from {new Date(property.available_from).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            {property.lease_term_months && (
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{property.lease_term_months} months lease</span>
                                                </div>
                                            )}
                                            {property.is_invite_only && (
                                                <div className="flex items-center space-x-2">
                                                    <Key className="h-4 w-4" />
                                                    <span>Invite only</span>
                                                </div>
                                            )}
                                            {property.access_code && (
                                                <div className="flex items-center space-x-2">
                                                    <Shield className="h-4 w-4" />
                                                    <span>Access code: {property.access_code}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {property.virtual_tour_url && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Virtual Tour</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="aspect-video rounded-lg bg-muted">
                                            <div className="flex h-full items-center justify-center">
                                                <div className="text-center text-muted-foreground">
                                                    <Eye className="mx-auto h-8 w-8" />
                                                    <p>Virtual tour would be embedded here</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle>Location</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-start space-x-2">
                                            <MapPin className="mt-0.5 h-5 w-5" />
                                            <div>
                                                <p>{property.address}</p>
                                                <p className="text-muted-foreground">
                                                    {property.city}, {property.postal_code}, {property.country}
                                                </p>
                                            </div>
                                        </div>

                                        {property.latitude && property.longitude && (
                                            <div className="mt-4 h-64 rounded-lg bg-muted">
                                                <div className="flex h-full items-center justify-center">
                                                    <div className="text-center text-muted-foreground">
                                                        <Globe className="mx-auto h-8 w-8" />
                                                        <p>Map view would be displayed here</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button className="w-full" asChild>
                                        <Link href={`/dashboard/properties/${property.id}/edit`}>
                                            <Edit3 className="mr-2 h-4 w-4" />
                                            Edit Property
                                        </Link>
                                    </Button>
                                    <Button variant="destructive" className="w-full cursor-pointer">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Property
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Visibility</span>
                                            <Badge variant={property.is_visible ? 'default' : 'secondary'}>
                                                {property.is_visible ? 'Visible' : 'Hidden'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Active</span>
                                            <Badge variant={property.is_active ? 'default' : 'secondary'}>
                                                {property.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Created</span>
                                            <span className="text-sm">{new Date(property.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Last Updated</span>
                                            <span className="text-sm">{new Date(property.updated_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default PropertyDetailsPage;
