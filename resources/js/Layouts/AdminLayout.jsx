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
    CalendarClock,
    Bell,
    Landmark,
    RotateCcw,
    ShieldCheck,
    UserCheck,
    QrCode,
    Archive,
    Building2,
    LockKeyhole,
    CreditCard,
    Eye,
    EyeOff,
} from 'lucide-react';
import CompanyBranding from '../Components/CompanyBranding';
import AppFooter from '../Components/AppFooter';
import ThemeToggle from '../Components/ThemeToggle';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/services', label: 'Manajemen Servis', icon: Wrench },
    { href: '/admin/bookings', label: 'Booking Servis', icon: CalendarClock },
    { href: '/admin/work-orders', label: 'Surat Perintah Kerja', icon: FileText },
    { href: '/admin/sales', label: 'Penjualan (POS)', icon: ShoppingCart },
    { href: '/admin/customers', label: 'Pelanggan', icon: Users },
    { href: '/admin/spare-parts', label: 'Spare Part & Stok', icon: Package },
    { href: '/admin/stock-movements', label: 'Kartu Stok', icon: QrCode, advanced: true },
    { href: '/admin/mechanics', label: 'Data Mekanik', icon: Users, advanced: true },
    { href: '/admin/mechanic-ops', label: 'Operasional Mekanik', icon: UserCheck, roles: ['owner', 'admin'], advanced: true },
    { href: '/admin/reports', label: 'Laporan', icon: BarChart3, advanced: true },
    { href: '/admin/finance', label: 'Buku Kas & Laba Rugi', icon: Landmark, roles: ['owner', 'admin'], advanced: true },
    { href: '/admin/expenses', label: 'Pengeluaran Bengkel', icon: Wallet, advanced: true },
    { href: '/admin/suppliers', label: 'Supplier', icon: Truck, advanced: true },
    { href: '/admin/purchase-orders', label: 'Pengadaan Barang (PO)', icon: ShoppingBag, advanced: true },
    { href: '/admin/returns', label: 'Retur & Refund', icon: RotateCcw, roles: ['owner', 'admin', 'cashier', 'purchasing'], advanced: true },
    { href: '/admin/warranty-claims', label: 'Klaim Garansi', icon: ShieldCheck, advanced: true },
    { href: '/admin/crm/follow-ups', label: 'CRM Follow-up', icon: UserCheck, advanced: true },
    { href: '/admin/audit-logs', label: 'Audit Log', icon: LockKeyhole, roles: ['owner', 'admin'], advanced: true },
    { href: '/admin/branches-warehouses', label: 'Cabang & Gudang', icon: Building2, roles: ['owner', 'admin'], advanced: true },
    { href: '/admin/backups', label: 'Backup & Restore', icon: Archive, roles: ['owner', 'admin'], advanced: true },
    { href: '/admin/pro/notifications', label: 'Notifikasi Otomatis', icon: Bell, pro: true, advanced: true },
    { href: '/admin/pro/digital-payments', label: 'Pembayaran Digital', icon: CreditCard, pro: true, advanced: true },
    { href: '/admin/cms/posts', label: 'Konten Situs', icon: Globe, advanced: true },
    { href: '/admin/settings', label: 'Pengaturan Aplikasi', icon: Settings, advanced: true },
    { href: '/admin/system-update', label: 'Update GitHub', icon: Download, advanced: true },
];

export default function AdminLayout({ children, title }) {
    const { props, url } = usePage();
    const { auth } = props;
    const user = auth?.user;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [simpleMode, setSimpleMode] = useState(() => {
        const saved = localStorage.getItem('admin_simple_mode');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('admin_simple_mode', JSON.stringify(simpleMode));
    }, [simpleMode]);

    const isActive = (href) => {
        if (href === '/admin' && url === '/admin') return true;
        if (href !== '/admin' && url?.startsWith(href)) return true;
        return false;
    };

    const canSee = (item) => {
        if (item.href === '/admin/system-update' && user?.role !== 'admin' && user?.role !== 'owner') return false;
        if (simpleMode && item.advanced) return false;
        if (!item.roles) return true;
        return item.roles.includes(user?.role) || user?.role === 'admin';
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
                    {navItems.filter(canSee).map(item => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`admin-nav-link${active ? ' is-active' : ''}`}
                            >
                                <item.icon size={20} strokeWidth={active ? 2 : 1.75} style={{ flexShrink: 0 }} />
                                {!collapsed && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', minWidth: 0 }}>
                                        <span>{item.label}</span>
                                        {item.pro && (
                                            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--color-warning)', border: '1px solid rgba(245,158,11,0.45)', borderRadius: '999px', padding: '0.05rem 0.35rem' }}>
                                                PRO
                                            </span>
                                        )}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{
                    padding: '0.75rem 0.25rem',
                    borderTop: '1px solid var(--color-sidebar-border)',
                    marginTop: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    boxSizing: 'border-box',
                }}>
                    {!collapsed ? (
                        <button
                            type="button"
                            onClick={() => setSimpleMode(!simpleMode)}
                            className="admin-nav-link"
                            style={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                background: simpleMode ? 'var(--color-primary-alpha)' : 'transparent',
                                border: '1px dashed rgba(161, 161, 170, 0.2)',
                                cursor: 'pointer',
                                padding: '0.5rem 0.75rem',
                                color: simpleMode ? 'var(--color-primary-light)' : 'var(--color-sidebar-text)',
                            }}
                        >
                            {simpleMode ? <EyeOff size={18} /> : <Eye size={18} />}
                            <span style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', lineHeight: '1.2' }}>
                                <span style={{ fontWeight: 600 }}>{simpleMode ? 'Mode Sederhana' : 'Mode Lengkap'}</span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                                    {simpleMode ? 'Menu disederhanakan' : 'Semua menu aktif'}
                                </span>
                            </span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setSimpleMode(!simpleMode)}
                            className="admin-nav-link"
                            style={{
                                justifyContent: 'center',
                                background: simpleMode ? 'var(--color-primary-alpha)' : 'transparent',
                                border: '1px dashed rgba(161, 161, 170, 0.2)',
                                cursor: 'pointer',
                                padding: '0.625rem 0',
                                width: '100%',
                                color: simpleMode ? 'var(--color-primary-light)' : 'var(--color-sidebar-text)',
                            }}
                            title={simpleMode ? 'Mode Sederhana (Klik untuk Mode Lengkap)' : 'Mode Lengkap (Klik untuk Mode Sederhana)'}
                        >
                            {simpleMode ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
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
