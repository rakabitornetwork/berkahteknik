import React from 'react';
import { Link } from '@inertiajs/react';
import { User } from 'lucide-react';
import CompanyBranding from '../Components/CompanyBranding';
import AppFooter from '../Components/AppFooter';

export default function PortalLayout({ children, customer }) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
            <nav
                className="portal-header"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    background: 'rgba(9, 9, 11, 0.92)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--color-border)',
                }}
            >
                <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0.875rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="/portal/dashboard" style={{ textDecoration: 'none' }}>
                        <CompanyBranding variant="portal" />
                    </Link>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {customer ? (
                            <>
                                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <User size={16} /> {customer.name}
                                </span>
                                <Link href="/portal/logout" method="post" as="button"
                                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', cursor: 'pointer', color: 'var(--color-text-muted)', transition: 'all var(--transition-fast)' }}
                                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-danger)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.backgroundColor = 'var(--color-surface)'; }}
                                >Keluar</Link>
                            </>
                        ) : (
                            <Link href="/portal/login" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>Login</Link>
                        )}
                    </div>
                </div>
            </nav>

            <main style={{ flex: 1, padding: '2rem 1.5rem' }}>
                <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>

            <AppFooter variant="portal" />
        </div>
    );
}
