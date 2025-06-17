import { DashboardHeader } from '@/components/dashboard-header';
import { PropertyTypeIcon } from '@/components/property-type-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { OccupancyStatus, PropertyType } from '@/types/property';
import { Head, useForm } from '@inertiajs/react';
import { Calendar, Home, Key, PlusCircle, ScanEye } from 'lucide-react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Properties',
        href: '/dashboard/properties',
    },
    {
        title: 'Add New Property',
        href: '/dashboard/properties/create',
    },
];

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

export default function AddPropertyPage() {
    const { data, setData, post, processing, errors } = useForm({
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
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/dashboard/properties');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Property" />

            <div className="flex flex-1 flex-col">
                <DashboardHeader title="Add New Property" />

                <div className="flex-1 p-4 sm:p-6">
                    <Card>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Core Information Section */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="grid">
                                            <Label htmlFor="title" className="mb-2">
                                                Title
                                            </Label>
                                            <Input
                                                id="title"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                placeholder="Beautiful Downtown Apartment"
                                                required
                                            />
                                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                        </div>

                                        <div className="grid">
                                            <Label htmlFor="address" className="mb-2">
                                                Address
                                            </Label>
                                            <Input
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                placeholder="123 Main St"
                                                required
                                            />
                                            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                                        </div>

                                        <div className="grid">
                                            <Label htmlFor="city" className="mb-2">
                                                City
                                            </Label>
                                            <Input
                                                id="city"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                placeholder="New York"
                                                required
                                            />
                                            {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                                        </div>

                                        <div className="grid">
                                            <Label htmlFor="postal_code" className="mb-2">
                                                Postal Code
                                            </Label>
                                            <Input
                                                id="postal_code"
                                                value={data.postal_code}
                                                onChange={(e) => setData('postal_code', e.target.value)}
                                                placeholder="10001"
                                            />
                                            {errors.postal_code && <p className="text-sm text-red-500">{errors.postal_code}</p>}
                                        </div>

                                        <div className="grid self-start">
                                            <Label htmlFor="country" className="mb-2">
                                                Country
                                            </Label>
                                            <Input
                                                id="country"
                                                value={data.country}
                                                onChange={(e) => setData('country', e.target.value)}
                                                placeholder="United States"
                                            />
                                            {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                                        </div>

                                        <div className="grid">
                                            <Label htmlFor="description" className="mb-2">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder="Describe the property..."
                                                rows={4}
                                            />
                                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Rent & Availability Section */}
                                <div className="space-y-4">
                                    <h3 className="flex items-center text-lg font-medium">
                                        <Calendar className="mr-2 h-5 w-5" />
                                        Rent & Availability
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="occupancy_status">Occupancy Status</Label>
                                            <Select
                                                value={data.occupancy_status}
                                                onValueChange={(value) => setData('occupancy_status', value as OccupancyStatus)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {occupancyStatuses.map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.occupancy_status && <p className="text-sm text-red-500">{errors.occupancy_status}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="rent_amount">Rent Amount</Label>
                                            <Input
                                                id="rent_amount"
                                                type="number"
                                                value={data.rent_amount}
                                                onChange={(e) => setData('rent_amount', e.target.value)}
                                                placeholder="1500"
                                                required
                                            />
                                            {errors.rent_amount && <p className="text-sm text-red-500">{errors.rent_amount}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="security_deposit">Security Deposit</Label>
                                            <Input
                                                id="security_deposit"
                                                type="number"
                                                value={data.security_deposit}
                                                onChange={(e) => setData('security_deposit', e.target.value)}
                                                placeholder="1500"
                                            />
                                            {errors.security_deposit && <p className="text-sm text-red-500">{errors.security_deposit}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="available_from">Available From</Label>
                                            <Input
                                                id="available_from"
                                                type="date"
                                                value={data.available_from}
                                                onChange={(e) => setData('available_from', e.target.value)}
                                                required
                                            />
                                            {errors.available_from && <p className="text-sm text-red-500">{errors.available_from}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lease_term_months">Lease Term (months)</Label>
                                            <Input
                                                id="lease_term_months"
                                                type="number"
                                                value={data.lease_term_months}
                                                onChange={(e) => setData('lease_term_months', e.target.value)}
                                                placeholder="12"
                                            />
                                            {errors.lease_term_months && <p className="text-sm text-red-500">{errors.lease_term_months}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Property Details Section */}
                                <div className="space-y-4">
                                    <h3 className="flex items-center text-lg font-medium">
                                        <Home className="mr-2 h-5 w-5" />
                                        Property Details
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="property_type">Property Type</Label>
                                            <Select
                                                value={data.property_type}
                                                onValueChange={(value) => setData('property_type', value as PropertyType)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {propertyTypes.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            <div className="flex items-center">
                                                                <PropertyTypeIcon type={type} />
                                                                {type}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.property_type && <p className="text-sm text-red-500">{errors.property_type}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="square_meters">Size (m²)</Label>
                                            <Input
                                                id="square_meters"
                                                type="number"
                                                value={data.square_meters}
                                                onChange={(e) => setData('square_meters', e.target.value)}
                                                placeholder="85"
                                                required
                                            />
                                            {errors.square_meters && <p className="text-sm text-red-500">{errors.square_meters}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bedrooms">Bedrooms</Label>
                                            <Input
                                                id="bedrooms"
                                                type="number"
                                                min="0"
                                                value={data.bedrooms}
                                                onChange={(e) => setData('bedrooms', parseInt(e.target.value))}
                                            />
                                            {errors.bedrooms && <p className="text-sm text-red-500">{errors.bedrooms}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bathrooms">Bathrooms</Label>
                                            <Input
                                                id="bathrooms"
                                                type="number"
                                                min="0"
                                                value={data.bathrooms}
                                                onChange={(e) => setData('bathrooms', parseInt(e.target.value))}
                                            />
                                            {errors.bathrooms && <p className="text-sm text-red-500">{errors.bathrooms}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="floor_number">Floor Number</Label>
                                            <Input
                                                id="floor_number"
                                                type="number"
                                                min="0"
                                                value={data.floor_number}
                                                onChange={(e) => setData('floor_number', e.target.value)}
                                            />
                                            {errors.floor_number && <p className="text-sm text-red-500">{errors.floor_number}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="total_floors">Total Floors in Building</Label>
                                            <Input
                                                id="total_floors"
                                                type="number"
                                                min="0"
                                                value={data.total_floors}
                                                onChange={(e) => setData('total_floors', e.target.value)}
                                            />
                                            {errors.total_floors && <p className="text-sm text-red-500">{errors.total_floors}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="year_built">Year Built</Label>
                                            <Input
                                                id="year_built"
                                                type="number"
                                                min="1800"
                                                max={new Date().getFullYear()}
                                                value={data.year_built}
                                                onChange={(e) => setData('year_built', e.target.value)}
                                            />
                                            {errors.year_built && <p className="text-sm text-red-500">{errors.year_built}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="heating_type">Heating Type</Label>
                                            <Select value={data.heating_type} onValueChange={(value) => setData('heating_type', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select heating type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {heatingTypes.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.heating_type && <p className="text-sm text-red-500">{errors.heating_type}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="energy_class">Energy Class</Label>
                                            <Select value={data.energy_class} onValueChange={(value) => setData('energy_class', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select energy class" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {energyClasses.map((cls) => (
                                                        <SelectItem key={cls} value={cls}>
                                                            {cls}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.energy_class && <p className="text-sm text-red-500">{errors.energy_class}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="indoor_parking_spots">Indoor Parking Spots</Label>
                                            <Input
                                                id="indoor_parking_spots"
                                                type="number"
                                                min="0"
                                                value={data.indoor_parking_spots}
                                                onChange={(e) => setData('indoor_parking_spots', parseInt(e.target.value))}
                                            />
                                            {errors.indoor_parking_spots && <p className="text-sm text-red-500">{errors.indoor_parking_spots}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="outdoor_parking_spots">Outdoor Parking Spots</Label>
                                            <Input
                                                id="outdoor_parking_spots"
                                                type="number"
                                                min="0"
                                                value={data.outdoor_parking_spots}
                                                onChange={(e) => setData('outdoor_parking_spots', parseInt(e.target.value))}
                                            />
                                            {errors.outdoor_parking_spots && <p className="text-sm text-red-500">{errors.outdoor_parking_spots}</p>}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="furnished"
                                                checked={data.furnished}
                                                onCheckedChange={(checked) => setData('furnished', Boolean(checked))}
                                            />
                                            <Label htmlFor="furnished">Furnished</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="pets_allowed"
                                                checked={data.pets_allowed}
                                                onCheckedChange={(checked) => setData('pets_allowed', Boolean(checked))}
                                            />
                                            <Label htmlFor="pets_allowed">Pets Allowed</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="smoking_allowed"
                                                checked={data.smoking_allowed}
                                                onCheckedChange={(checked) => setData('smoking_allowed', Boolean(checked))}
                                            />
                                            <Label htmlFor="smoking_allowed">Smoking Allowed</Label>
                                        </div>
                                    </div>
                                </div>

                                {/* Media Section */}
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
                                                value={data.cover_image_url}
                                                onChange={(e) => setData('cover_image_url', e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            {errors.cover_image_url && <p className="text-sm text-red-500">{errors.cover_image_url}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="virtual_tour_url">Virtual Tour URL</Label>
                                            <Input
                                                id="virtual_tour_url"
                                                value={data.virtual_tour_url}
                                                onChange={(e) => setData('virtual_tour_url', e.target.value)}
                                                placeholder="https://example.com/virtual-tour"
                                            />
                                            {errors.virtual_tour_url && <p className="text-sm text-red-500">{errors.virtual_tour_url}</p>}
                                        </div>

                                        {/* Note: For photo_gallery, you might want a more sophisticated file upload component */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="photo_gallery">Photo Gallery (JSON array of URLs)</Label>
                                            <Textarea
                                                id="photo_gallery"
                                                value={JSON.stringify(data.photo_gallery)}
                                                onChange={(e) => {
                                                    try {
                                                        setData('photo_gallery', JSON.parse(e.target.value));
                                                    } catch {
                                                        setData('photo_gallery', []);
                                                    }
                                                }}
                                                placeholder='["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"]'
                                                rows={3}
                                            />
                                            {errors.photo_gallery && <p className="text-sm text-red-500">{errors.photo_gallery}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Visibility & Access Section */}
                                <div className="space-y-4">
                                    <h3 className="flex items-center text-lg font-medium">
                                        <Key className="mr-2 h-5 w-5" />
                                        Visibility & Access
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_visible"
                                                checked={data.is_visible}
                                                onCheckedChange={(checked) => setData('is_visible', Boolean(checked))}
                                            />
                                            <Label htmlFor="is_visible">Visible to Public</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_active"
                                                checked={data.is_active}
                                                onCheckedChange={(checked) => setData('is_active', Boolean(checked))}
                                            />
                                            <Label htmlFor="is_active">Active Listing</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_invite_only"
                                                checked={data.is_invite_only}
                                                onCheckedChange={(checked) => setData('is_invite_only', Boolean(checked))}
                                            />
                                            <Label htmlFor="is_invite_only">Invite Only</Label>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="access_code">Access Code</Label>
                                            <Input
                                                id="access_code"
                                                value={data.access_code}
                                                onChange={(e) => setData('access_code', e.target.value)}
                                                placeholder="Optional access code"
                                            />
                                            {errors.access_code && <p className="text-sm text-red-500">{errors.access_code}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        {processing ? 'Creating...' : 'Create Property'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
