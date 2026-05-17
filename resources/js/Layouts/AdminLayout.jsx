import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Wrench, 
    Users, 
    Package, 
    BarChart3, 
    LogOut, 
    Menu, 
    Fan
} from 'lucide-react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/services', label: 'Manajemen Servis', icon: Wrench },
    { href: '/admin/customers', label: 'Pelanggan', icon: Users },
    { href: '/admin/spare-parts', label: 'Spare Part & Stok', icon: Package },
    { href: '/admin/reports', label: 'Laporan', icon: BarChart3 },
];

export default function AdminLayout({ children, title }) {
    const { props, url } = usePage();
    const { auth } = props;
    const user = auth?.user;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    
    // Helper untuk menentukan menu aktif
    const isActive = (href) => {
        if (href === '/admin' && url === '/admin') return true;
        if (href !== '/admin' && url?.startsWith(href)) return true;
        return false;
    };

    // Close mobile sidebar when navigating
    useEffect(() => {
        setMobileOpen(false);
    }, [usePage().url]);

    return (
        <div className="admin-layout-container">
            {/* Mobile Backdrop */}
            {mobileOpen && (
                <div 
                    onClick={() => setMobileOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', 
                        zIndex: 30, backdropFilter: 'blur(4px)'
                    }}
                />
            )}

            {/* Sidebar (Dark Theme ala Screenshot) */}
            <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
                style={{
                    backgroundColor: '#111111', // Sangat gelap (dark mode)
                    borderRight: '1px solid #27272a',
                    padding: '1.25rem 0.75rem',
                    color: '#a1a1aa' // Text abu-abu terang
                }}
            >
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', height: '64px', padding: '0 0.5rem', overflow: 'hidden' }}>
                    <div style={{ color: '#fbbf24', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        <Fan size={26} strokeWidth={2.5} />
                    </div>
                    {!collapsed && <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', whiteSpace: 'nowrap' }}>AC Berkah</span>}
                </div>

                <div style={{ height: '1px', background: '#27272a', margin: '0 -0.75rem 1rem -0.75rem' }} />

                {/* Nav */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                    {navItems.map(item => {
                        const active = isActive(item.href);
                        return (
                            <Link key={item.href} href={item.href}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.85rem',
                                    padding: '0.625rem 0.75rem', borderRadius: '8px',
                                    fontSize: '0.875rem', fontWeight: active ? 600 : 500,
                                    color: active ? '#ffffff' : '#a1a1aa',
                                    backgroundColor: active ? '#27272a' : 'transparent',
                                    textDecoration: 'none',
                                    transition: 'all 150ms ease',
                                    whiteSpace: 'nowrap', overflow: 'hidden',
                                }}
                                onMouseEnter={e => { 
                                    if (!active) {
                                        e.currentTarget.style.color = '#e4e4e7'; 
                                        e.currentTarget.style.backgroundColor = 'rgba(39, 39, 42, 0.5)';
                                    }
                                }}
                                onMouseLeave={e => { 
                                    if (!active) {
                                        e.currentTarget.style.color = '#a1a1aa'; 
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                <item.icon size={20} strokeWidth={active ? 2 : 1.75} style={{ flexShrink: 0 }} />
                                {!collapsed && item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #27272a' }}>
                    {!collapsed && (
                        <div style={{ marginBottom: '0.75rem', padding: '0 0.5rem', overflow: 'hidden' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#e4e4e7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                            <div style={{ color: '#71717a', fontSize: '0.75rem' }}>Administrator</div>
                        </div>
                    )}
                    <Link href="/admin/logout" method="post" as="button"
                        style={{ 
                            width: '100%', padding: '0.625rem 0.75rem', fontSize: '0.875rem', borderRadius: '8px', 
                            border: 'none', background: 'transparent', cursor: 'pointer', color: '#a1a1aa', 
                            transition: 'all 150ms ease', display: 'flex', alignItems: 'center', gap: '0.85rem'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                        <LogOut size={20} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                        {!collapsed && <span style={{ fontWeight: 500 }}>Logout</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Area */}
            <div className="admin-main-content">
                {/* Top Header */}
                <header className="glass-header" style={{ 
                    height: '64px', padding: '0 1.5rem', borderRadius: 'var(--radius-lg)', 
                    marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', 
                    alignItems: 'center', gap: '1rem', flexShrink: 0, flexWrap: 'nowrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Hamburger button (Mobile) */}
                        <button 
                            className="mobile-only"
                            onClick={() => setMobileOpen(true)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '0 0.5rem' }}
                        >
                            <Menu size={24} strokeWidth={2} />
                        </button>
                        {/* Desktop collapse button */}
                        <button 
                            className="desktop-only"
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                        >
                            <Menu size={22} strokeWidth={2} />
                        </button>
                        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>
                            {title || 'Dashboard'}
                        </h1>
                    </div>
                    <Link href="/admin/services/create" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem', whiteSpace: 'nowrap' }}>
                        + Input Servis
                    </Link>
                </header>

                {/* Content */}
                <main style={{ flex: 1 }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
