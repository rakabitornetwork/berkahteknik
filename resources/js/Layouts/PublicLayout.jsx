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

export default function PublicLayout({ children, variant = 'default' }) {
    const { auth } = usePage().props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const headerRef = React.useRef(null);
    const scrolledRef = React.useRef(false);
    const isLanding = variant === 'landing';

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
    const postsHref = isLanding ? '#berita-promo' : '/#berita-promo';

    const scrollToHash = (hash) => {
        const id = hash.replace(/^#/, '');
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const navLink = (href, label, ink, { hash = false, mobile = false } = {}) => {
        const className = mobile ? 'public-nav-mobile-link' : undefined;
        const style = {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: ink || 'var(--color-text-muted)',
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
            className={`public-site${isLanding ? ' public-site--landing' : ''}`}
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: isLanding ? undefined : 'var(--color-bg)' }}
        >
            <header
                ref={headerRef}
                className="public-site-header"
                style={{
                    position: isLanding ? undefined : 'sticky',
                    top: 0,
                    zIndex: 50,
                    borderBottom: isLanding ? undefined : '1px solid var(--color-border)',
                }}
            >
                <div
                    className={isLanding ? 'public-site-header-inner' : undefined}
                    style={isLanding ? undefined : { maxWidth: 1120, margin: '0 auto', padding: '0.95rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}
                >
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <CompanyBranding variant="portal" />
                    </Link>

                    <nav className="public-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        {navLink('/', 'Beranda')}
                        {navLink(postsHref, 'Berita & Promo', undefined, { hash: isLanding })}
                        {!isLanding && <ThemeToggle />}
                        <Link href={ctaUrl} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.1rem', borderRadius: 2, boxShadow: 'none' }}>
                            {ctaLabel}
                        </Link>
                    </nav>

                    <div className="public-nav-mobile-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {!isLanding && <ThemeToggle />}
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
                        {navLink('/', 'Beranda', isLanding ? '#3d4f5c' : undefined, { mobile: true })}
                        {navLink(postsHref, 'Berita & Promo', isLanding ? '#3d4f5c' : undefined, { hash: isLanding, mobile: true })}
                        <Link
                            href={ctaUrl}
                            className="btn btn-primary"
                            style={{ textAlign: 'center', borderRadius: 2, background: isLanding ? '#0d6e6e' : undefined, color: isLanding ? '#fff' : undefined, boxShadow: 'none' }}
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
