import React from 'react';
import { Head, usePage } from '@inertiajs/react';

const DEFAULT_FAVICON = '/images/brand/favicon.svg';
const DEFAULT_LOGO = '/images/brand/logo.svg';
const DEFAULT_APPLE = '/images/brand/apple-touch-icon.png';

export default function DocumentIcons() {
    const shop = usePage().props.shop || {};
    const favicon = shop.favicon_url || DEFAULT_FAVICON;
    const logo = shop.logo_url || DEFAULT_LOGO;
    const apple = shop.logo_url || DEFAULT_APPLE;
    const name = shop.app_name || 'Berkah Teknik AC';

    return (
        <Head>
            <link rel="icon" href={favicon} />
            <link rel="apple-touch-icon" href={apple} />
            <meta name="theme-color" content="#0f766e" />
            <meta property="og:site_name" content={name} />
            <meta property="og:image" content={logo} />
        </Head>
    );
}
