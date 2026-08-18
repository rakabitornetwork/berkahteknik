import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import DocumentIcons from './DocumentIcons';

const VISUAL = {
    admin: {
        kicker: 'Operasional bengkel',
        title: 'Kelola servis dengan alur kerja yang rapi.',
        lead: 'Masuk ke panel admin untuk mengatur antrean, mekanik, inventori, dan laporan harian.',
        image: '/images/landing/about-default.jpg',
        eyebrow: 'Akses staf',
    },
    portal: {
        kicker: 'Layanan pelanggan',
        title: 'Pantau progres servis kendaraan Anda.',
        lead: 'Booking jadwal, lacak status perbaikan, dan kelola klaim garansi lewat portal pelanggan.',
        image: '/images/landing/hero-default.jpg',
        eyebrow: 'Portal pelanggan',
    },
};

export default function AuthScreen({
    headTitle,
    title,
    subtitle,
    children,
    footer,
    backHref = '/',
    backLabel = 'Kembali ke beranda',
    variant = 'portal',
    maxWidth,
}) {
    const { shop } = usePage().props;
    const brand = shop?.app_name || shop?.legal_name || 'Berkah Teknik AC';
    const initial = brand.slice(0, 2).toUpperCase();
    const visual = VISUAL[variant] || VISUAL.portal;

    return (
        <div className={`auth-screen auth-screen--${variant}`}>
            <Head title={headTitle} />
            <DocumentIcons />

            <aside className="auth-visual" aria-hidden="false">
                <img
                    className="auth-visual-media"
                    src={visual.image}
                    alt=""
                    width={1920}
                    height={1280}
                    decoding="async"
                />
                <div className="auth-visual-shade" />
                <div className="auth-visual-grain" />
                <div className="auth-visual-copy">
                    <p className="auth-visual-kicker">{visual.kicker}</p>
                    <p className="auth-visual-brand">{brand}</p>
                    <h1 className="auth-visual-title">{visual.title}</h1>
                    <p className="auth-visual-lead">{visual.lead}</p>
                </div>
            </aside>

            <section className="auth-panel">
                <div className="auth-panel-top">
                    {backHref ? (
                        <Link href={backHref} className="auth-back">
                            <ArrowLeft size={15} strokeWidth={2} />
                            {backLabel}
                        </Link>
                    ) : (
                        <span />
                    )}
                    <ThemeToggle />
                </div>

                <div className="auth-panel-inner" style={maxWidth ? { maxWidth } : undefined}>
                    <div className="auth-brand-mark">
                        {shop?.logo_url ? (
                            <img src={shop.logo_url} alt={brand} />
                        ) : (
                            <span className="auth-brand-mark-badge" aria-hidden="true">{initial}</span>
                        )}
                        <div>
                            <strong>{brand}</strong>
                            <span>{visual.eyebrow}</span>
                        </div>
                    </div>

                    <h2 className="auth-title">{title}</h2>
                    {subtitle && <p className="auth-subtitle">{subtitle}</p>}

                    {children}
                    {footer}
                </div>
            </section>
        </div>
    );
}

export function AuthField({ label, htmlFor, error, children, required = false }) {
    return (
        <div className="auth-field">
            <label className="auth-label" htmlFor={htmlFor}>
                {label}
                {required && <span style={{ color: '#c2410c' }}> *</span>}
            </label>
            {children}
            {error && <div className="auth-error">{error}</div>}
        </div>
    );
}
