import React from 'react';
import { Link } from '@inertiajs/react';
import { User, LogOut, Wrench } from 'lucide-react';
import CompanyBranding from '../Components/CompanyBranding';
import AppFooter from '../Components/AppFooter';
import ThemeToggle from '../Components/ThemeToggle';

export default function MechanicLayout({ children, mechanic }) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
            <nav
                className="portal-header"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    borderBottom: '1px solid var(--color-border)',
                }}
            >
                <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0.875rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="/mechanic/dashboard" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CompanyBranding variant="portal" />
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', background: 'var(--color-primary-light)', color: 'white', padding: '0.15rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                            Mekanik
                        </span>
                    </Link>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <ThemeToggle />
                        {mechanic ? (
                            <>
                                <span style={{ fontSize: '0.875rem', fontWeight: 550, color: 'var(--color-text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <User size={16} /> {mechanic.name}
                                </span>
                                <Link href="/admin/logout" method="post" as="button"
                                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', cursor: 'pointer', color: 'var(--color-text-muted)', transition: 'all var(--transition-fast)' }}
                                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-danger)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.backgroundColor = 'var(--color-surface)'; }}
                                >
                                    <LogOut size={14} style={{ marginRight: '0.25rem', display: 'inline' }} /> Keluar
                                </Link>
                            </>
                        ) : (
                            <Link href="/admin/login" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>Login</Link>
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
