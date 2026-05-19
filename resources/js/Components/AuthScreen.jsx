import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export function AuthBrand({ title, subtitle }) {
    const { shop } = usePage().props;
    const initial = (shop?.short_name || shop?.app_name || 'AC').slice(0, 2).toUpperCase();

    return (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {shop?.logo_url ? (
                <img
                    src={shop.logo_url}
                    alt={shop.short_name || shop.app_name}
                    style={{ height: 48, marginBottom: '1rem', objectFit: 'contain' }}
                />
            ) : (
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'var(--color-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        marginBottom: '1rem',
                    }}
                >
                    {initial}
                </div>
            )}
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>{title}</h1>
            {subtitle && (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}

export default function AuthScreen({
    headTitle,
    title,
    subtitle,
    children,
    footer,
    backHref = '/',
    backLabel = 'Kembali ke beranda',
    maxWidth = 400,
}) {
    return (
        <div
            className="auth-screen"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-bg)',
                padding: '1.5rem',
            }}
        >
            <Head title={headTitle} />

            <div style={{ width: '100%', maxWidth }}>
                {backHref && (
                    <Link
                        href={backHref}
                        style={{
                            display: 'inline-block',
                            marginBottom: '1rem',
                            fontSize: '0.8rem',
                            color: 'var(--color-text-muted)',
                            textDecoration: 'none',
                        }}
                    >
                        ← {backLabel}
                    </Link>
                )}

                <div className="glass-panel" style={{ width: '100%', padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
                    <AuthBrand title={title} subtitle={subtitle} />
                    {children}
                    {footer}
                </div>
            </div>
        </div>
    );
}
