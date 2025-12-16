import Axios from 'axios';

/**
 * Pre-configured axios instance with CSRF token handling.
 * Use this for background API calls that shouldn't trigger Inertia page visits.
 *
 * For form submissions that should update page state, use Inertia's router instead.
 */
const axios = Axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Add CSRF token to all requests
axios.interceptors.request.use((config) => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
});

export default axios;
