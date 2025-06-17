import { PropertyType } from '@/types/property';
import { Building, Building2, Home, MapPin, Warehouse } from 'lucide-react';

export const PropertyTypeIcon = ({ type }: { type: PropertyType }) => {
    switch (type) {
        case 'House':
        case 'Detached House':
        case 'Semi‑detached House':
            return <Home className="h-4 w-4 text-muted-foreground" />;
        case 'Apartment':
        case 'Studio':
        case 'Penthouse':
        case 'Loft':
        case 'Duplex':
        case 'Triplex':
            return <Building className="h-4 w-4 text-muted-foreground" />;
        case 'Garage':
            return <Warehouse className="h-4 w-4 text-muted-foreground" />;
        case 'Office':
            return <Building2 className="h-4 w-4 text-muted-foreground" />;
        default:
            return <MapPin className="h-4 w-4 text-muted-foreground" />;
    }
};
