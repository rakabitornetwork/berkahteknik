import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import CompanyBranding from '../Components/CompanyBranding';
import AppFooter from '../Components/AppFooter';
import ThemeToggle from '../Components/ThemeToggle';

export function portalCtaUrl(auth, landingCtaUrl) {
    if (auth?.customer) {
        return '/portal/dashboard';
    }
    return landingCtaUrl || '/portal/login';
}

export default function PublicLayout({ children }) {
    const { auth, shop } = usePage().props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const ctaUrl = portalCtaUrl(auth, '/portal/login');
    const ctaLabel = auth?.customer ? 'Portal Saya' : 'Portal Pelanggan';

    const navLink = (href, label, active = false) => (
        <Link
            href={href}
            style={{
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 500,
                color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                textDecoration: 'none',
            }}
            onClick={() => setMobileOpen(false)}
        >
            {label}
        </Link>
    );

    return (
        <div className="public-site" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
            <header
                className="public-site-header"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    borderBottom: '1px solid var(--color-border)',
                }}
            >
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <CompanyBranding variant="portal" />
                    </Link>

                    <nav className="public-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {navLink('/', 'Beranda')}
                        {navLink('/konten', 'Berita & Promo')}
                        <ThemeToggle />
                        <Link href={ctaUrl} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}>
                            {ctaLabel}
                        </Link>
                    </nav>

                    <div className="public-nav-mobile-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ThemeToggle />
                        <button
                            type="button"
                            className="public-nav-toggle"
                            onClick={() => setMobileOpen((v) => !v)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', padding: '0.25rem' }}
                            aria-label="Menu"
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <div style={{ padding: '0 1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                        {navLink('/', 'Beranda')}
                        {navLink('/konten', 'Berita & Promo')}
                        <Link href={ctaUrl} className="btn btn-primary" style={{ textAlign: 'center' }} onClick={() => setMobileOpen(false)}>
                            {ctaLabel}
                        </Link>
                    </div>
                )}
            </header>

            <main style={{ flex: 1 }}>{children}</main>

            <AppFooter variant="portal" />
        </div>
    );
}
