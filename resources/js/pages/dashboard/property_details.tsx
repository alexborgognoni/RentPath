import ***REMOVED*** DashboardHeader ***REMOVED*** from '@/components/dashboard-header';
import ***REMOVED*** PropertyTypeIcon ***REMOVED*** from '@/components/property-type-icon';
import ***REMOVED*** Badge ***REMOVED*** from '@/components/ui/badge';
import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import ***REMOVED*** Card, CardContent, CardHeader, CardTitle ***REMOVED*** from '@/components/ui/card';
import ***REMOVED*** Separator ***REMOVED*** from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import ***REMOVED*** type BreadcrumbItem ***REMOVED*** from '@/types';
import ***REMOVED*** OccupancyStatus, Property ***REMOVED*** from '@/types/property';
import ***REMOVED*** PageProps as InertiaPageProps ***REMOVED*** from '@inertiajs/core';
import ***REMOVED*** Head, Link, usePage ***REMOVED*** from '@inertiajs/react';
import ***REMOVED***
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
***REMOVED*** from 'lucide-react';

interface PageProps extends InertiaPageProps ***REMOVED***
    property: Property;
***REMOVED***

const getOccupancyStatusBadgeVariant = (status: OccupancyStatus) => ***REMOVED***
    switch (status) ***REMOVED***
        case 'Occupied':
            return 'default';
        case 'Vacant':
            return 'secondary';
        case 'Under Maintenance':
            return 'destructive';
        default:
            return 'outline';
***REMOVED***
***REMOVED***;

const PropertyDetailsPage = () => ***REMOVED***
    const ***REMOVED*** property ***REMOVED*** = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        ***REMOVED***
            title: 'Properties',
            href: '/dashboard/properties',
    ***REMOVED***,
        ***REMOVED***
            title: property.address,
            href: `/dashboard/properties/$***REMOVED***property.id***REMOVED***`,
    ***REMOVED***,
    ];

    const propertyFeatures = [
        ***REMOVED*** icon: <BedDouble className="h-4 w-4" />, label: `$***REMOVED***property.bedrooms***REMOVED*** Bed(s)` ***REMOVED***,
        ***REMOVED*** icon: <Bath className="h-4 w-4" />, label: `$***REMOVED***property.bathrooms***REMOVED*** Bath(s)` ***REMOVED***,
        ***REMOVED*** icon: <Ruler className="h-4 w-4" />, label: `$***REMOVED***property.square_meters***REMOVED*** m²` ***REMOVED***,
        ***REMOVED*** icon: <Car className="h-4 w-4" />, label: `$***REMOVED***property.indoor_parking_spots***REMOVED*** Indoor` ***REMOVED***,
        ***REMOVED*** icon: <Car className="h-4 w-4" />, label: `$***REMOVED***property.outdoor_parking_spots***REMOVED*** Outdoor` ***REMOVED***,
        ...(property.furnished ? [***REMOVED*** icon: <Home className="h-4 w-4" />, label: 'Furnished' ***REMOVED***] : []),
        ...(property.pets_allowed ? [***REMOVED*** icon: <Dog className="h-4 w-4" />, label: 'Pets allowed' ***REMOVED***] : []),
        ...(property.smoking_allowed ? [***REMOVED*** icon: <Cigarette className="h-4 w-4" />, label: 'Smoking allowed' ***REMOVED***] : []),
        ...(property.heating_type ? [***REMOVED*** icon: <Thermometer className="h-4 w-4" />, label: property.heating_type ***REMOVED***] : []),
        ...(property.energy_class ? [***REMOVED*** icon: <HousePlug className="h-4 w-4" />, label: `Energy class: $***REMOVED***property.energy_class***REMOVED***` ***REMOVED***] : []),
    ];

    return (
        <AppLayout breadcrumbs=***REMOVED***breadcrumbs***REMOVED***>
            <Head title=***REMOVED***`Property - $***REMOVED***property.address***REMOVED***`***REMOVED*** />

            <div className="flex flex-1 flex-col">
                <DashboardHeader title=***REMOVED***property.title***REMOVED*** />
                <div className="flex-1 space-y-6 p-4 sm:p-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        ***REMOVED***/* Main content */***REMOVED***
                        <div className="space-y-6 lg:col-span-2">
                            ***REMOVED***/* Property images */***REMOVED***
                            <Card>
                                <CardHeader>
                                    <div>
                                        <CardTitle>Photos</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    ***REMOVED***/* ***REMOVED***property.photo_gallery && property.photo_gallery.length > 0 ? ( */***REMOVED***
                                    ***REMOVED***/*     <Carousel> */***REMOVED***
                                    ***REMOVED***/*         ***REMOVED***property.photo_gallery.map((image, index) => ( */***REMOVED***
                                    ***REMOVED***/*             <div key=***REMOVED***index***REMOVED*** className="h-80 w-full"> */***REMOVED***
                                    ***REMOVED***/*                 <img */***REMOVED***
                                    ***REMOVED***/*                     src=***REMOVED***image***REMOVED*** */***REMOVED***
                                    ***REMOVED***/*                     alt=***REMOVED***`Property $***REMOVED*** index + 1***REMOVED***`***REMOVED*** */***REMOVED***
                                    ***REMOVED***/*                     className="h-full w-full rounded-lg object-cover" */***REMOVED***
                                    ***REMOVED***/*                 /> */***REMOVED***
                                    ***REMOVED***/*             </div> */***REMOVED***
                                    ***REMOVED***/*         ))***REMOVED*** */***REMOVED***
                                    ***REMOVED***/*     </Carousel> */***REMOVED***
                                    ***REMOVED***/* ) : ( */***REMOVED***
                                    ***REMOVED***
                                        <div className="flex h-60 items-center justify-center rounded-lg bg-muted">
                                            <div className="flex flex-col items-center text-muted-foreground">
                                                <ImageIcon className="h-10 w-10" />
                                                <p className="mt-2">No photos available</p>
                                            </div>
                                        </div>
                                ***REMOVED***
                                </CardContent>
                            </Card>

                            ***REMOVED***/* Property details */***REMOVED***
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Details</CardTitle>
                                        <Badge variant=***REMOVED***getOccupancyStatusBadgeVariant(property.occupancy_status)***REMOVED***>***REMOVED***property.occupancy_status***REMOVED***</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-1">
                                            <p className="text-muted-foreground">***REMOVED***property.description***REMOVED***</p>
                                        </div>
                                        <div className="ml-7.5 text-right">
                                            <p className="text-2xl font-bold">$***REMOVED***property.rent_amount.toLocaleString()***REMOVED***/mo</p>
                                            ***REMOVED***property.security_deposit && (
                                                <p className="text-sm text-muted-foreground">$***REMOVED***property.security_deposit.toLocaleString()***REMOVED*** deposit</p>
                                            )***REMOVED***
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                        ***REMOVED***propertyFeatures.map((feature, index) => (
                                            <div key=***REMOVED***index***REMOVED*** className="flex items-center space-x-2">
                                                ***REMOVED***feature.icon***REMOVED***
                                                <span className="text-sm">***REMOVED***feature.label***REMOVED***</span>
                                            </div>
                                        ))***REMOVED***
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h4 className="font-medium">Additional Information</h4>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="flex items-center space-x-2">
                                                <PropertyTypeIcon type=***REMOVED***property.property_type***REMOVED*** />
                                                <span>***REMOVED***property.property_type***REMOVED***</span>
                                            </div>
                                            ***REMOVED***property.floor_number && (
                                                <div className="flex items-center space-x-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>
                                                        Floor ***REMOVED***property.floor_number***REMOVED***
                                                        ***REMOVED***property.total_floors && ` of $***REMOVED***property.total_floors***REMOVED*** `***REMOVED***
                                                    </span>
                                                </div>
                                            )***REMOVED***
                                            ***REMOVED***property.year_built && (
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Built in ***REMOVED***property.year_built***REMOVED***</span>
                                                </div>
                                            )***REMOVED***
                                            ***REMOVED***property.available_from && (
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Available from ***REMOVED***new Date(property.available_from).toLocaleDateString()***REMOVED***</span>
                                                </div>
                                            )***REMOVED***
                                            ***REMOVED***property.lease_term_months && (
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>***REMOVED***property.lease_term_months***REMOVED*** months lease</span>
                                                </div>
                                            )***REMOVED***
                                            ***REMOVED***property.is_invite_only && (
                                                <div className="flex items-center space-x-2">
                                                    <Key className="h-4 w-4" />
                                                    <span>Invite only</span>
                                                </div>
                                            )***REMOVED***
                                            ***REMOVED***property.access_code && (
                                                <div className="flex items-center space-x-2">
                                                    <Shield className="h-4 w-4" />
                                                    <span>Access code: ***REMOVED***property.access_code***REMOVED***</span>
                                                </div>
                                            )***REMOVED***
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            ***REMOVED***/* Virtual tour */***REMOVED***
                            ***REMOVED***property.virtual_tour_url && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Virtual Tour</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="aspect-video rounded-lg bg-muted">
                                            ***REMOVED***/* Virtual tour embed would go here */***REMOVED***
                                            <div className="flex h-full items-center justify-center">
                                                <div className="text-center text-muted-foreground">
                                                    <Eye className="mx-auto h-8 w-8" />
                                                    <p>Virtual tour would be embedded here</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )***REMOVED***

                            ***REMOVED***/* Location */***REMOVED***
                            <Card>
                                <CardHeader>
                                    <CardTitle>Location</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-start space-x-2">
                                            <MapPin className="mt-0.5 h-5 w-5" />
                                            <div>
                                                <p>***REMOVED***property.address***REMOVED***</p>
                                                <p className="text-muted-foreground">
                                                    ***REMOVED***property.city***REMOVED***, ***REMOVED***property.postal_code***REMOVED***, ***REMOVED***property.country***REMOVED***
                                                </p>
                                            </div>
                                        </div>

                                        ***REMOVED***property.latitude && property.longitude && (
                                            <div className="mt-4 h-64 rounded-lg bg-muted">
                                                ***REMOVED***/* Map integration would go here */***REMOVED***
                                                <div className="flex h-full items-center justify-center">
                                                    <div className="text-center text-muted-foreground">
                                                        <Globe className="mx-auto h-8 w-8" />
                                                        <p>Map view would be displayed here</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )***REMOVED***
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        ***REMOVED***/* Sidebar - Removed virtual tour from here */***REMOVED***
                        <div className="space-y-6">
                            ***REMOVED***/* Actions */***REMOVED***
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button className="w-full" asChild>
                                        <Link href=***REMOVED***`/dashboard/properties/$***REMOVED***property.id***REMOVED***/edit`***REMOVED***>
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

                            ***REMOVED***/* Status */***REMOVED***
                            <Card>
                                <CardHeader>
                                    <CardTitle>Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Visibility</span>
                                            <Badge variant=***REMOVED***property.is_visible ? 'default' : 'secondary'***REMOVED***>
                                                ***REMOVED***property.is_visible ? 'Visible' : 'Hidden'***REMOVED***
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Active</span>
                                            <Badge variant=***REMOVED***property.is_active ? 'default' : 'secondary'***REMOVED***>
                                                ***REMOVED***property.is_active ? 'Active' : 'Inactive'***REMOVED***
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Created</span>
                                            <span className="text-sm">***REMOVED***new Date(property.created_at).toLocaleDateString()***REMOVED***</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Last Updated</span>
                                            <span className="text-sm">***REMOVED***new Date(property.updated_at).toLocaleDateString()***REMOVED***</span>
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
***REMOVED***;

export default PropertyDetailsPage;
