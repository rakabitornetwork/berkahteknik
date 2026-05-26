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
    ShoppingCart,
    ShoppingBag,
    FileText,
    Settings,
    Globe,
    Download,
    Truck,
    Wallet,
} from 'lucide-react';
import CompanyBranding from '../Components/CompanyBranding';
import AppFooter from '../Components/AppFooter';
import ThemeToggle from '../Components/ThemeToggle';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/services', label: 'Manajemen Servis', icon: Wrench },
    { href: '/admin/work-orders', label: 'Surat Perintah Kerja', icon: FileText },
    { href: '/admin/sales', label: 'Penjualan (POS)', icon: ShoppingCart },
    { href: '/admin/customers', label: 'Pelanggan', icon: Users },
    { href: '/admin/spare-parts', label: 'Spare Part & Stok', icon: Package },
    { href: '/admin/mechanics', label: 'Data Mekanik', icon: Users },
    { href: '/admin/reports', label: 'Laporan', icon: BarChart3 },
    { href: '/admin/expenses', label: 'Pengeluaran Bengkel', icon: Wallet },
    { href: '/admin/suppliers', label: 'Supplier', icon: Truck },
    { href: '/admin/purchase-orders', label: 'Pengadaan Barang (PO)', icon: ShoppingBag },
    { href: '/admin/cms/posts', label: 'Konten Situs', icon: Globe },
    { href: '/admin/settings', label: 'Pengaturan Aplikasi', icon: Settings },
    { href: '/admin/system-update', label: 'Update GitHub', icon: Download },
];

export default function AdminLayout({ children, title }) {
    const { props, url } = usePage();
    const { auth } = props;
    const user = auth?.user;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (href) => {
        if (href === '/admin' && url === '/admin') return true;
        if (href !== '/admin' && url?.startsWith(href)) return true;
        return false;
    };

    useEffect(() => {
        setMobileOpen(false);
    }, [usePage().url]);

    return (
        <div className="admin-layout-container">
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        zIndex: 30, backdropFilter: 'blur(4px)',
                    }}
                />
            )}

            <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
                <div className="admin-sidebar-brand">
                    <CompanyBranding collapsed={collapsed} />
                </div>

                <nav className="admin-nav">
                    {navItems.filter(item => item.href !== '/admin/system-update' || user?.role === 'admin').map(item => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`admin-nav-link${active ? ' is-active' : ''}`}
                            >
                                <item.icon size={20} strokeWidth={active ? 2 : 1.75} style={{ flexShrink: 0 }} />
                                {!collapsed && item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <div className="admin-main-content">
                <header style={{
                    height: '54px', padding: '0 1rem',
                    background: 'var(--color-bg)',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', flexShrink: 0, boxSizing: 'border-box',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <button
                            type="button"
                            className="mobile-only"
                            onClick={() => setMobileOpen(true)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                        >
                            <Menu size={20} strokeWidth={2} />
                        </button>
                        <button
                            type="button"
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
                            <ThemeToggle />
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
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem', borderRadius: '50%', transition: 'all var(--transition-fast)',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-danger)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                                <LogOut size={14} strokeWidth={2.5} />
                            </Link>
                        </div>
                    </div>
                </header>

                <main>
                    {children}
                </main>
                <AppFooter variant="admin" />
            </div>
        </div>
    );
}
