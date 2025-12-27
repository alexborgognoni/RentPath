import { useEffect, useState } from 'react';

const STORAGE_KEY = 'rentpath_geo_country';
const DEFAULT_COUNTRY = 'NL'; // EU focus fallback

interface GeoLocationResult {
    countryCode: string;
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook to detect user's country from IP geolocation
 * Caches result in sessionStorage to avoid repeated API calls
 */
export function useGeoLocation(): GeoLocationResult {
    const [countryCode, setCountryCode] = useState<string>(() => {
        // Check sessionStorage first
        if (typeof window !== 'undefined') {
            const cached = sessionStorage.getItem(STORAGE_KEY);
            if (cached) return cached;
        }
        return DEFAULT_COUNTRY;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Skip if already cached
        if (typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY)) {
            return;
        }

        const detectCountry = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('https://ipapi.co/json/', {
                    signal: AbortSignal.timeout(5000), // 5 second timeout
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();

                if (data.country_code) {
                    const code = data.country_code.toUpperCase();
                    setCountryCode(code);
                    sessionStorage.setItem(STORAGE_KEY, code);
                }
            } catch (err) {
                // Silently fail - use default country
                setError(err instanceof Error ? err.message : 'Failed to detect location');
                console.debug('Geolocation detection failed, using default:', DEFAULT_COUNTRY);
            } finally {
                setIsLoading(false);
            }
        };

        detectCountry();
    }, []);

    return { countryCode, isLoading, error };
}

/**
 * Clear the cached geolocation (useful for testing)
 */
export function clearGeoLocationCache(): void {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEY);
    }
}
