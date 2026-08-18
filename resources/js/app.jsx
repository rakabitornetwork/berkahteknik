import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

let shopName = 'Bengkel AC Mobil';

function syncShopName(pageProps) {
    if (pageProps?.shop?.app_name) {
        shopName = pageProps.shop.app_name;
    }
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${shopName}` : shopName),
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        syncShopName(props.initialPage?.props);
        router.on('success', (event) => syncShopName(event.detail.page.props));

        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#005b96', // Deep Ocean Blue accent
    },
});
