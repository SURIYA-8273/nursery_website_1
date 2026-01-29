export const APP_CONFIG = {
    name: 'Plant Selling Website',
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
        timeout: 30000,
    },
    routes: {
        home: '/',
        plants: '/plants',
        cart: '/cart',
        favorites: '/wishlist',
        admin: {
            dashboard: '/admin/dashboard',
            login: '/admin/login',
        },
    },
} as const;
