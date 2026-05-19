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
    Fan,
    ShoppingCart,
    FileText,
    Settings,
} from 'lucide-react';
import CompanyBranding from '../Components/CompanyBranding';
import AppFooter from '../Components/AppFooter';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/services', label: 'Manajemen Servis', icon: Wrench },
    { href: '/admin/work-orders', label: 'Surat Perintah Kerja', icon: FileText },
    { href: '/admin/sales', label: 'Penjualan (POS)', icon: ShoppingCart },
    { href: '/admin/customers', label: 'Pelanggan', icon: Users },
    { href: '/admin/spare-parts', label: 'Spare Part & Stok', icon: Package },
    { href: '/admin/mechanics', label: 'Data Mekanik', icon: Users },
    { href: '/admin/reports', label: 'Laporan', icon: BarChart3 },
    { href: '/admin/settings', label: 'Pengaturan Aplikasi', icon: Settings },
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
                    padding: '0 0.75rem',
                    color: '#a1a1aa' // Text abu-abu terang
                }}
            >
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', height: '54px', padding: '0 0.5rem', overflow: 'hidden', borderBottom: '1px solid #27272a', margin: '0 -0.75rem', boxSizing: 'border-box' }}>
                    <CompanyBranding collapsed={collapsed} />
                </div>

                {/* Nav */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, marginTop: '1rem' }}>
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

            </aside>

            <div className="admin-main-content">
                {/* Top Header (Flat) */}
                <header style={{ 
                    height: '54px', padding: '0 1rem', 
                    borderBottom: '1px solid #27272a', 
                    display: 'flex', justifyContent: 'space-between', 
                    alignItems: 'center', flexShrink: 0, boxSizing: 'border-box'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        {/* Hamburger button (Mobile) */}
                        <button 
                            className="mobile-only"
                            onClick={() => setMobileOpen(true)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                        >
                            <Menu size={20} strokeWidth={2} />
                        </button>
                        {/* Desktop collapse button */}
                        <button 
                            className="desktop-only"
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                        >
                            <Menu size={20} strokeWidth={2} />
                        </button>
                        
                        <h1 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {title || 'Dashboard'}
                        </h1>
                    </div>

                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <Link 
                                href="/admin/profile"
                                style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', textDecoration: 'none' }}
                                title="Pengaturan Profil"
                            >
                                <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-text-main)', lineHeight: 1.2 }}>{user?.name || 'Administrator'}</div>
                                <div style={{ color: 'var(--color-primary)', fontSize: '0.7rem', fontWeight: 500 }}>Edit Profil &rarr;</div>
                            </Link>
                            <Link href="/admin/logout" method="post" as="button" title="Logout"
                                style={{ 
                                    background: 'transparent', border: '1px solid var(--color-border)', cursor: 'pointer', color: 'var(--color-text-muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem', borderRadius: '50%', transition: 'all var(--transition-fast)'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-danger)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                                <LogOut size={14} strokeWidth={2.5} />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main>
                    {children}
                </main>
                <AppFooter variant="admin" />
            </div>
        </div>
    );
}
