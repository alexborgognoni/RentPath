import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

export const translate = (key: keyof Translations): string => {
    const { props } = usePage<SharedData>();
    return props.translations?.[key] ?? key;
};
