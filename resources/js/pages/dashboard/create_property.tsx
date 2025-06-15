import ***REMOVED*** DashboardHeader ***REMOVED*** from '@/components/dashboard-header';
import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import ***REMOVED*** Card, CardContent ***REMOVED*** from '@/components/ui/card';
import ***REMOVED*** Checkbox ***REMOVED*** from '@/components/ui/checkbox';
import ***REMOVED*** Input ***REMOVED*** from '@/components/ui/input';
import ***REMOVED*** Label ***REMOVED*** from '@/components/ui/label';
import ***REMOVED*** Select, SelectContent, SelectItem, SelectTrigger, SelectValue ***REMOVED*** from '@/components/ui/select';
import ***REMOVED*** Textarea ***REMOVED*** from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import ***REMOVED*** type BreadcrumbItem ***REMOVED*** from '@/types';
import ***REMOVED*** OccupancyStatus, PropertyType ***REMOVED*** from '@/types/property';
import ***REMOVED*** Head, useForm ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** Building, Building2, Calendar, Home, Key, MapPin, PlusCircle, ScanEye, Warehouse ***REMOVED*** from 'lucide-react';
import ***REMOVED*** FormEvent ***REMOVED*** from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    ***REMOVED***
        title: 'Properties',
        href: '/dashboard/properties',
***REMOVED***,
    ***REMOVED***
        title: 'Add New Property',
        href: '/dashboard/properties/create',
***REMOVED***,
];

const PropertyTypeIcon = (***REMOVED*** type ***REMOVED***: ***REMOVED*** type: PropertyType ***REMOVED***) => ***REMOVED***
    switch (type) ***REMOVED***
        case 'House':
        case 'Detached House':
        case 'Semi‑detached House':
            return <Home className="mr-2 h-4 w-4 text-muted-foreground" />;
        case 'Apartment':
        case 'Studio':
        case 'Penthouse':
        case 'Loft':
        case 'Duplex':
        case 'Triplex':
            return <Building className="mr-2 h-4 w-4 text-muted-foreground" />;
        case 'Garage':
            return <Warehouse className="mr-2 h-4 w-4 text-muted-foreground" />;
        case 'Office':
            return <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />;
        default:
            return <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />;
***REMOVED***
***REMOVED***;

const propertyTypes: PropertyType[] = [
    'House',
    'Detached House',
    'Semi‑detached House',
    'Apartment',
    'Studio',
    'Penthouse',
    'Duplex',
    'Triplex',
    'Loft',
    'Garage',
    'Office',
] as const;

const occupancyStatuses: OccupancyStatus[] = ['Occupied', 'Vacant', 'Under Maintenance'];
const heatingTypes = ['Central', 'Electric', 'Gas', 'Oil', 'Solar', 'None'];
const energyClasses = ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

export default function AddPropertyPage() ***REMOVED***
    const ***REMOVED*** data, setData, post, processing, errors ***REMOVED*** = useForm(***REMOVED***
        // Core Info
        title: '',
        description: '',
        address: '',
        city: '',
        postal_code: '',
        country: '',

        // Location
        latitude: '',
        longitude: '',

        // Rent & Availability
        occupancy_status: 'Vacant' as OccupancyStatus,
        rent_amount: '',
        security_deposit: '',
        available_from: '',
        lease_term_months: '',

        // Property Details
        property_type: 'Apartment' as PropertyType,
        bedrooms: 1,
        bathrooms: 1,
        square_meters: '',
        floor_number: '',
        total_floors: '',
        year_built: '',
        furnished: false,
        pets_allowed: false,
        smoking_allowed: false,
        indoor_parking_spots: 0,
        outdoor_parking_spots: 0,
        heating_type: 'Central',
        energy_class: 'A',

        // Media
        cover_image_url: '',
        photo_gallery: [],
        virtual_tour_url: '',

        // Visibility & Access
        is_visible: true,
        is_active: true,
        is_invite_only: false,
        access_code: '',
***REMOVED***);

    const handleSubmit = (e: FormEvent) => ***REMOVED***
        e.preventDefault();
        post('/dashboard/properties');
***REMOVED***;

    return (
        <AppLayout breadcrumbs=***REMOVED***breadcrumbs***REMOVED***>
            <Head title="Add New Property" />

            <div className="flex flex-1 flex-col">
                <DashboardHeader title="Add New Property" />

                <div className="flex-1 p-4 sm:p-6">
                    <Card>
                        <CardContent>
                            <form onSubmit=***REMOVED***handleSubmit***REMOVED*** className="space-y-6">
                                ***REMOVED***/* Core Information Section */***REMOVED***
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="grid">
                                            <Label htmlFor="title" className="mb-2">
                                                Title
                                            </Label>
                                            <Input
                                                id="title"
                                                value=***REMOVED***data.title***REMOVED***
                                                onChange=***REMOVED***(e) => setData('title', e.target.value)***REMOVED***
                                                placeholder="Beautiful Downtown Apartment"
                                                required
                                            />
                                            ***REMOVED***errors.title && <p className="text-sm text-red-500">***REMOVED***errors.title***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="grid">
                                            <Label htmlFor="address" className="mb-2">
                                                Address
                                            </Label>
                                            <Input
                                                id="address"
                                                value=***REMOVED***data.address***REMOVED***
                                                onChange=***REMOVED***(e) => setData('address', e.target.value)***REMOVED***
                                                placeholder="123 Main St"
                                                required
                                            />
                                            ***REMOVED***errors.address && <p className="text-sm text-red-500">***REMOVED***errors.address***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="grid">
                                            <Label htmlFor="city" className="mb-2">
                                                City
                                            </Label>
                                            <Input
                                                id="city"
                                                value=***REMOVED***data.city***REMOVED***
                                                onChange=***REMOVED***(e) => setData('city', e.target.value)***REMOVED***
                                                placeholder="New York"
                                                required
                                            />
                                            ***REMOVED***errors.city && <p className="text-sm text-red-500">***REMOVED***errors.city***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="grid">
                                            <Label htmlFor="postal_code" className="mb-2">
                                                Postal Code
                                            </Label>
                                            <Input
                                                id="postal_code"
                                                value=***REMOVED***data.postal_code***REMOVED***
                                                onChange=***REMOVED***(e) => setData('postal_code', e.target.value)***REMOVED***
                                                placeholder="10001"
                                            />
                                            ***REMOVED***errors.postal_code && <p className="text-sm text-red-500">***REMOVED***errors.postal_code***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="grid self-start">
                                            <Label htmlFor="country" className="mb-2">
                                                Country
                                            </Label>
                                            <Input
                                                id="country"
                                                value=***REMOVED***data.country***REMOVED***
                                                onChange=***REMOVED***(e) => setData('country', e.target.value)***REMOVED***
                                                placeholder="United States"
                                            />
                                            ***REMOVED***errors.country && <p className="text-sm text-red-500">***REMOVED***errors.country***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="grid">
                                            <Label htmlFor="description" className="mb-2">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value=***REMOVED***data.description***REMOVED***
                                                onChange=***REMOVED***(e) => setData('description', e.target.value)***REMOVED***
                                                placeholder="Describe the property..."
                                                rows=***REMOVED***4***REMOVED***
                                            />
                                            ***REMOVED***errors.description && <p className="text-sm text-red-500">***REMOVED***errors.description***REMOVED***</p>***REMOVED***
                                        </div>
                                    </div>
                                </div>

                                ***REMOVED***/* Rent & Availability Section */***REMOVED***
                                <div className="space-y-4">
                                    <h3 className="flex items-center text-lg font-medium">
                                        <Calendar className="mr-2 h-5 w-5" />
                                        Rent & Availability
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="occupancy_status">Occupancy Status</Label>
                                            <Select
                                                value=***REMOVED***data.occupancy_status***REMOVED***
                                                onValueChange=***REMOVED***(value) => setData('occupancy_status', value as OccupancyStatus)***REMOVED***
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    ***REMOVED***occupancyStatuses.map((status) => (
                                                        <SelectItem key=***REMOVED***status***REMOVED*** value=***REMOVED***status***REMOVED***>
                                                            ***REMOVED***status***REMOVED***
                                                        </SelectItem>
                                                    ))***REMOVED***
                                                </SelectContent>
                                            </Select>
                                            ***REMOVED***errors.occupancy_status && <p className="text-sm text-red-500">***REMOVED***errors.occupancy_status***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="rent_amount">Rent Amount</Label>
                                            <Input
                                                id="rent_amount"
                                                type="number"
                                                value=***REMOVED***data.rent_amount***REMOVED***
                                                onChange=***REMOVED***(e) => setData('rent_amount', e.target.value)***REMOVED***
                                                placeholder="1500"
                                                required
                                            />
                                            ***REMOVED***errors.rent_amount && <p className="text-sm text-red-500">***REMOVED***errors.rent_amount***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="security_deposit">Security Deposit</Label>
                                            <Input
                                                id="security_deposit"
                                                type="number"
                                                value=***REMOVED***data.security_deposit***REMOVED***
                                                onChange=***REMOVED***(e) => setData('security_deposit', e.target.value)***REMOVED***
                                                placeholder="1500"
                                            />
                                            ***REMOVED***errors.security_deposit && <p className="text-sm text-red-500">***REMOVED***errors.security_deposit***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="available_from">Available From</Label>
                                            <Input
                                                id="available_from"
                                                type="date"
                                                value=***REMOVED***data.available_from***REMOVED***
                                                onChange=***REMOVED***(e) => setData('available_from', e.target.value)***REMOVED***
                                                required
                                            />
                                            ***REMOVED***errors.available_from && <p className="text-sm text-red-500">***REMOVED***errors.available_from***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lease_term_months">Lease Term (months)</Label>
                                            <Input
                                                id="lease_term_months"
                                                type="number"
                                                value=***REMOVED***data.lease_term_months***REMOVED***
                                                onChange=***REMOVED***(e) => setData('lease_term_months', e.target.value)***REMOVED***
                                                placeholder="12"
                                            />
                                            ***REMOVED***errors.lease_term_months && <p className="text-sm text-red-500">***REMOVED***errors.lease_term_months***REMOVED***</p>***REMOVED***
                                        </div>
                                    </div>
                                </div>

                                ***REMOVED***/* Property Details Section */***REMOVED***
                                <div className="space-y-4">
                                    <h3 className="flex items-center text-lg font-medium">
                                        <Home className="mr-2 h-5 w-5" />
                                        Property Details
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="property_type">Property Type</Label>
                                            <Select
                                                value=***REMOVED***data.property_type***REMOVED***
                                                onValueChange=***REMOVED***(value) => setData('property_type', value as PropertyType)***REMOVED***
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    ***REMOVED***propertyTypes.map((type) => (
                                                        <SelectItem key=***REMOVED***type***REMOVED*** value=***REMOVED***type***REMOVED***>
                                                            <div className="flex items-center">
                                                                <PropertyTypeIcon type=***REMOVED***type***REMOVED*** />
                                                                ***REMOVED***type***REMOVED***
                                                            </div>
                                                        </SelectItem>
                                                    ))***REMOVED***
                                                </SelectContent>
                                            </Select>
                                            ***REMOVED***errors.property_type && <p className="text-sm text-red-500">***REMOVED***errors.property_type***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="square_meters">Size (m²)</Label>
                                            <Input
                                                id="square_meters"
                                                type="number"
                                                value=***REMOVED***data.square_meters***REMOVED***
                                                onChange=***REMOVED***(e) => setData('square_meters', e.target.value)***REMOVED***
                                                placeholder="85"
                                                required
                                            />
                                            ***REMOVED***errors.square_meters && <p className="text-sm text-red-500">***REMOVED***errors.square_meters***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bedrooms">Bedrooms</Label>
                                            <Input
                                                id="bedrooms"
                                                type="number"
                                                min="0"
                                                value=***REMOVED***data.bedrooms***REMOVED***
                                                onChange=***REMOVED***(e) => setData('bedrooms', parseInt(e.target.value))***REMOVED***
                                            />
                                            ***REMOVED***errors.bedrooms && <p className="text-sm text-red-500">***REMOVED***errors.bedrooms***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bathrooms">Bathrooms</Label>
                                            <Input
                                                id="bathrooms"
                                                type="number"
                                                min="0"
                                                value=***REMOVED***data.bathrooms***REMOVED***
                                                onChange=***REMOVED***(e) => setData('bathrooms', parseInt(e.target.value))***REMOVED***
                                            />
                                            ***REMOVED***errors.bathrooms && <p className="text-sm text-red-500">***REMOVED***errors.bathrooms***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="floor_number">Floor Number</Label>
                                            <Input
                                                id="floor_number"
                                                type="number"
                                                min="0"
                                                value=***REMOVED***data.floor_number***REMOVED***
                                                onChange=***REMOVED***(e) => setData('floor_number', e.target.value)***REMOVED***
                                            />
                                            ***REMOVED***errors.floor_number && <p className="text-sm text-red-500">***REMOVED***errors.floor_number***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="total_floors">Total Floors in Building</Label>
                                            <Input
                                                id="total_floors"
                                                type="number"
                                                min="0"
                                                value=***REMOVED***data.total_floors***REMOVED***
                                                onChange=***REMOVED***(e) => setData('total_floors', e.target.value)***REMOVED***
                                            />
                                            ***REMOVED***errors.total_floors && <p className="text-sm text-red-500">***REMOVED***errors.total_floors***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="year_built">Year Built</Label>
                                            <Input
                                                id="year_built"
                                                type="number"
                                                min="1800"
                                                max=***REMOVED***new Date().getFullYear()***REMOVED***
                                                value=***REMOVED***data.year_built***REMOVED***
                                                onChange=***REMOVED***(e) => setData('year_built', e.target.value)***REMOVED***
                                            />
                                            ***REMOVED***errors.year_built && <p className="text-sm text-red-500">***REMOVED***errors.year_built***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="heating_type">Heating Type</Label>
                                            <Select value=***REMOVED***data.heating_type***REMOVED*** onValueChange=***REMOVED***(value) => setData('heating_type', value)***REMOVED***>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select heating type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    ***REMOVED***heatingTypes.map((type) => (
                                                        <SelectItem key=***REMOVED***type***REMOVED*** value=***REMOVED***type***REMOVED***>
                                                            ***REMOVED***type***REMOVED***
                                                        </SelectItem>
                                                    ))***REMOVED***
                                                </SelectContent>
                                            </Select>
                                            ***REMOVED***errors.heating_type && <p className="text-sm text-red-500">***REMOVED***errors.heating_type***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="energy_class">Energy Class</Label>
                                            <Select value=***REMOVED***data.energy_class***REMOVED*** onValueChange=***REMOVED***(value) => setData('energy_class', value)***REMOVED***>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select energy class" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    ***REMOVED***energyClasses.map((cls) => (
                                                        <SelectItem key=***REMOVED***cls***REMOVED*** value=***REMOVED***cls***REMOVED***>
                                                            ***REMOVED***cls***REMOVED***
                                                        </SelectItem>
                                                    ))***REMOVED***
                                                </SelectContent>
                                            </Select>
                                            ***REMOVED***errors.energy_class && <p className="text-sm text-red-500">***REMOVED***errors.energy_class***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="indoor_parking_spots">Indoor Parking Spots</Label>
                                            <Input
                                                id="indoor_parking_spots"
                                                type="number"
                                                min="0"
                                                value=***REMOVED***data.indoor_parking_spots***REMOVED***
                                                onChange=***REMOVED***(e) => setData('indoor_parking_spots', parseInt(e.target.value))***REMOVED***
                                            />
                                            ***REMOVED***errors.indoor_parking_spots && <p className="text-sm text-red-500">***REMOVED***errors.indoor_parking_spots***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="outdoor_parking_spots">Outdoor Parking Spots</Label>
                                            <Input
                                                id="outdoor_parking_spots"
                                                type="number"
                                                min="0"
                                                value=***REMOVED***data.outdoor_parking_spots***REMOVED***
                                                onChange=***REMOVED***(e) => setData('outdoor_parking_spots', parseInt(e.target.value))***REMOVED***
                                            />
                                            ***REMOVED***errors.outdoor_parking_spots && <p className="text-sm text-red-500">***REMOVED***errors.outdoor_parking_spots***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="furnished"
                                                checked=***REMOVED***data.furnished***REMOVED***
                                                onCheckedChange=***REMOVED***(checked) => setData('furnished', Boolean(checked))***REMOVED***
                                            />
                                            <Label htmlFor="furnished">Furnished</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="pets_allowed"
                                                checked=***REMOVED***data.pets_allowed***REMOVED***
                                                onCheckedChange=***REMOVED***(checked) => setData('pets_allowed', Boolean(checked))***REMOVED***
                                            />
                                            <Label htmlFor="pets_allowed">Pets Allowed</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="smoking_allowed"
                                                checked=***REMOVED***data.smoking_allowed***REMOVED***
                                                onCheckedChange=***REMOVED***(checked) => setData('smoking_allowed', Boolean(checked))***REMOVED***
                                            />
                                            <Label htmlFor="smoking_allowed">Smoking Allowed</Label>
                                        </div>
                                    </div>
                                </div>

                                ***REMOVED***/* Media Section */***REMOVED***
                                <div className="space-y-4">
                                    <h3 className="flex items-center text-lg font-medium">
                                        <ScanEye className="mr-2 h-5 w-5" />
                                        Media
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="cover_image_url">Cover Image URL</Label>
                                            <Input
                                                id="cover_image_url"
                                                value=***REMOVED***data.cover_image_url***REMOVED***
                                                onChange=***REMOVED***(e) => setData('cover_image_url', e.target.value)***REMOVED***
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            ***REMOVED***errors.cover_image_url && <p className="text-sm text-red-500">***REMOVED***errors.cover_image_url***REMOVED***</p>***REMOVED***
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="virtual_tour_url">Virtual Tour URL</Label>
                                            <Input
                                                id="virtual_tour_url"
                                                value=***REMOVED***data.virtual_tour_url***REMOVED***
                                                onChange=***REMOVED***(e) => setData('virtual_tour_url', e.target.value)***REMOVED***
                                                placeholder="https://example.com/virtual-tour"
                                            />
                                            ***REMOVED***errors.virtual_tour_url && <p className="text-sm text-red-500">***REMOVED***errors.virtual_tour_url***REMOVED***</p>***REMOVED***
                                        </div>

                                        ***REMOVED***/* Note: For photo_gallery, you might want a more sophisticated file upload component */***REMOVED***
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="photo_gallery">Photo Gallery (JSON array of URLs)</Label>
                                            <Textarea
                                                id="photo_gallery"
                                                value=***REMOVED***JSON.stringify(data.photo_gallery)***REMOVED***
                                                onChange=***REMOVED***(e) => ***REMOVED***
                                                    try ***REMOVED***
                                                        setData('photo_gallery', JSON.parse(e.target.value));
                                                ***REMOVED*** catch ***REMOVED***
                                                        setData('photo_gallery', []);
                                                ***REMOVED***
                                            ***REMOVED******REMOVED***
                                                placeholder='["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"]'
                                                rows=***REMOVED***3***REMOVED***
                                            />
                                            ***REMOVED***errors.photo_gallery && <p className="text-sm text-red-500">***REMOVED***errors.photo_gallery***REMOVED***</p>***REMOVED***
                                        </div>
                                    </div>
                                </div>

                                ***REMOVED***/* Visibility & Access Section */***REMOVED***
                                <div className="space-y-4">
                                    <h3 className="flex items-center text-lg font-medium">
                                        <Key className="mr-2 h-5 w-5" />
                                        Visibility & Access
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_visible"
                                                checked=***REMOVED***data.is_visible***REMOVED***
                                                onCheckedChange=***REMOVED***(checked) => setData('is_visible', Boolean(checked))***REMOVED***
                                            />
                                            <Label htmlFor="is_visible">Visible to Public</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_active"
                                                checked=***REMOVED***data.is_active***REMOVED***
                                                onCheckedChange=***REMOVED***(checked) => setData('is_active', Boolean(checked))***REMOVED***
                                            />
                                            <Label htmlFor="is_active">Active Listing</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_invite_only"
                                                checked=***REMOVED***data.is_invite_only***REMOVED***
                                                onCheckedChange=***REMOVED***(checked) => setData('is_invite_only', Boolean(checked))***REMOVED***
                                            />
                                            <Label htmlFor="is_invite_only">Invite Only</Label>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="access_code">Access Code</Label>
                                            <Input
                                                id="access_code"
                                                value=***REMOVED***data.access_code***REMOVED***
                                                onChange=***REMOVED***(e) => setData('access_code', e.target.value)***REMOVED***
                                                placeholder="Optional access code"
                                            />
                                            ***REMOVED***errors.access_code && <p className="text-sm text-red-500">***REMOVED***errors.access_code***REMOVED***</p>***REMOVED***
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="outline" onClick=***REMOVED***() => window.history.back()***REMOVED***>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled=***REMOVED***processing***REMOVED***>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        ***REMOVED***processing ? 'Creating...' : 'Create Property'***REMOVED***
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
***REMOVED***
