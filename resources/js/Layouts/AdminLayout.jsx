import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '⊞' },
    { href: '/admin/services', label: 'Manajemen Servis', icon: '🔧' },
    { href: '/admin/customers', label: 'Pelanggan', icon: '👤' },
    { href: '/admin/spare-parts', label: 'Spare Part & Stok', icon: '📦' },
    { href: '/admin/reports', label: 'Laporan', icon: '📊' },
];

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
            {/* Sidebar */}
            <aside style={{
                width: collapsed ? '64px' : '240px',
                transition: 'width var(--transition-normal)',
                margin: '0.75rem 0 0.75rem 0.75rem',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
            }}
                className="glass-panel"
                style2={{
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.25rem 0.75rem',
                }}
            >
                <div className="glass-panel" style={{ borderRadius: 'var(--radius-xl)', padding: '1.25rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', margin: '0.75rem 0 0.75rem 0.75rem', width: collapsed ? '64px' : '240px', transition: 'width var(--transition-normal)', flexShrink: 0 }}>
                    {/* Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', overflow: 'hidden' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1rem', flexShrink: 0, boxShadow: 'var(--shadow-glow)' }}>
                            AC
                        </div>
                        {!collapsed && <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary-dark)', whiteSpace: 'nowrap' }}>Bengkel AC Berkah</span>}
                    </div>

                    {/* Nav */}
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                        {navItems.map(item => (
                            <Link key={item.href} href={item.href}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)',
                                    fontSize: '0.875rem', fontWeight: 500,
                                    color: 'var(--color-text-muted)',
                                    textDecoration: 'none',
                                    transition: 'all var(--transition-fast)',
                                    whiteSpace: 'nowrap', overflow: 'hidden',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-alpha)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                            >
                                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                                {!collapsed && item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* User */}
                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                        {!collapsed && (
                            <div style={{ marginBottom: '0.5rem', overflow: 'hidden' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Administrator</div>
                            </div>
                        )}
                        <Link href="/admin/logout" method="post" as="button"
                            style={{ width: '100%', padding: '0.4rem', fontSize: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)', transition: 'all var(--transition-fast)' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-danger)'; e.currentTarget.style.color = 'var(--color-danger)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                        >
                            {collapsed ? '⤦' : 'Logout'}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, padding: '0.75rem 0.75rem 0.75rem 0' }}>
                {/* Top Header */}
                <header className="glass-header" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => setCollapsed(!collapsed)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>
                            ☰
                        </button>
                        <h1 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>{title || 'Dashboard'}</h1>
                    </div>
                    <Link href="/admin/services/create" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>
                        + Input Servis
                    </Link>
                </header>

                {/* Content */}
                <main style={{ flex: 1, overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
