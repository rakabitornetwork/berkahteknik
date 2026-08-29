import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import CompanyBranding from '../Components/CompanyBranding';
import AppFooter from '../Components/AppFooter';
import ThemeToggle from '../Components/ThemeToggle';
import DocumentIcons from '../Components/DocumentIcons';

export function portalCtaUrl(auth, landingCtaUrl) {
    if (auth?.customer) {
        return '/portal/dashboard';
    }
    return landingCtaUrl || '/portal/login';
}

export default function PublicLayout({ children, variant = 'default' }) {
    const page = usePage();
    const { auth } = page.props;
    const url = page.url || '';
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const headerRef = React.useRef(null);
    const scrolledRef = React.useRef(false);
    const isLanding = variant === 'landing';
    const isEditorial = variant === 'editorial';
    const isBrand = isLanding || isEditorial;

    const ctaUrl = portalCtaUrl(auth, '/portal/login');
    const ctaLabel = auth?.customer ? 'Portal Saya' : 'Portal Pelanggan';

    const syncHeaderChrome = React.useCallback((scrolled, menuOpen) => {
        const header = headerRef.current;
        if (!header || !isLanding) return;
        header.classList.toggle('is-scrolled', scrolled);
        header.classList.toggle('is-menu-open', menuOpen);
    }, [isLanding]);

    React.useEffect(() => {
        if (!isLanding) return undefined;

        const header = headerRef.current;
        if (!header) return undefined;

        let frame = 0;

        const applyScrolled = (next) => {
            if (scrolledRef.current === next) return;
            scrolledRef.current = next;
            syncHeaderChrome(next, mobileOpen);
        };

        const onScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(() => {
                frame = 0;
                applyScrolled(window.scrollY > 24);
            });
        };

        applyScrolled(window.scrollY > 24);
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, [isLanding, mobileOpen, syncHeaderChrome]);

    React.useEffect(() => {
        syncHeaderChrome(scrolledRef.current, mobileOpen);
    }, [mobileOpen, syncHeaderChrome]);

    React.useEffect(() => {
        if (!mobileOpen) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') setMobileOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [mobileOpen]);

    const closeMobile = () => setMobileOpen(false);
    const postsHref = '/konten';

    const scrollToHash = (hash) => {
        const id = hash.replace(/^#/, '');
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const currentPath = url.split('?')[0];
    const isActivePath = (href) => (href !== '/' && currentPath.startsWith(href)) || (href === '/' && currentPath === '/');

    const navLink = (href, label, ink, { hash = false, mobile = false } = {}) => {
        const active = isActivePath(href);
        const className = mobile ? 'public-nav-mobile-link' : undefined;
        const style = {
            fontSize: '0.875rem',
            fontWeight: active ? 700 : 500,
            color: ink || (active && isEditorial ? '#0f766e' : 'var(--color-text-muted)'),
            textDecoration: 'none',
        };

        if (hash || href.startsWith('#')) {
            return (
                <a
                    href={href}
                    className={className}
                    style={style}
                    onClick={(e) => {
                        if (href.startsWith('#')) {
                            e.preventDefault();
                            scrollToHash(href);
                        }
                        closeMobile();
                    }}
                >
                    {label}
                </a>
            );
        }

        return (
            <Link
                href={href}
                className={className}
                style={style}
                onClick={closeMobile}
            >
                {label}
            </Link>
        );
    };

    return (
        <div
            className={`public-site${isBrand ? ' public-site--brand' : ''}${isLanding ? ' public-site--landing' : ''}${isEditorial ? ' public-site--editorial' : ''}`}
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: isBrand ? undefined : 'var(--color-bg)' }}
        >
            <DocumentIcons />
            <header
                ref={headerRef}
                className="public-site-header"
                style={{
                    position: isBrand ? undefined : 'sticky',
                    top: 0,
                    zIndex: 50,
                    borderBottom: isBrand ? undefined : '1px solid var(--color-border)',
                }}
            >
                <div
                    className={isBrand ? 'public-site-header-inner' : undefined}
                    style={isBrand ? undefined : { maxWidth: 1120, margin: '0 auto', padding: '0.95rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}
                >
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <CompanyBranding variant="portal" />
                    </Link>

                    <nav className="public-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        {navLink('/', 'Beranda')}
                        {navLink(postsHref, 'Berita & Promo')}
                        {!isBrand && <ThemeToggle />}
                        <Link href={ctaUrl} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.1rem', borderRadius: isBrand ? 12 : 2, boxShadow: 'none' }}>
                            {ctaLabel}
                        </Link>
                    </nav>

                    <div className="public-nav-mobile-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {!isBrand && <ThemeToggle />}
                        <button
                            type="button"
                            className="public-nav-toggle"
                            onClick={() => setMobileOpen((v) => !v)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', padding: '0.25rem' }}
                            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                            aria-expanded={mobileOpen}
                            aria-controls="public-nav-mobile-panel"
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                <div
                    id="public-nav-mobile-panel"
                    className={`public-nav-mobile-panel${mobileOpen ? ' is-open' : ''}`}
                    aria-hidden={!mobileOpen}
                >
                    <div className="public-nav-mobile-panel-inner">
                        {navLink('/', 'Beranda', isBrand ? '#3d4f5c' : undefined, { mobile: true })}
                        {navLink(postsHref, 'Berita & Promo', isBrand ? '#3d4f5c' : undefined, { mobile: true })}
                        <Link
                            href={ctaUrl}
                            className="btn btn-primary"
                            style={{ textAlign: 'center', borderRadius: isBrand ? 12 : 2, background: isBrand ? '#0d6e6e' : undefined, color: isBrand ? '#fff' : undefined, boxShadow: 'none' }}
                            onClick={closeMobile}
                            tabIndex={mobileOpen ? 0 : -1}
                        >
                            {ctaLabel}
                        </Link>
                    </div>
                </div>
            </header>

            <main style={{ flex: 1 }}>{children}</main>

            <AppFooter variant="portal" />
        </div>
    );
}
