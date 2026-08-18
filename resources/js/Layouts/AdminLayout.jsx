import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Wrench,
    Users,
    BarChart3,
    LogOut,
    Menu,
    ShoppingCart,
    ShoppingBag,
    FileText,
    Settings,
    Globe,
    Download,
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
    Database,
} from 'lucide-react';
import { MASTER_DATA_PREFIXES } from '../Pages/Admin/MasterData/MasterDataTabs';
import CompanyBranding from '../Components/CompanyBranding';
import AppFooter from '../Components/AppFooter';
import ThemeToggle from '../Components/ThemeToggle';
import DocumentIcons from '../Components/DocumentIcons';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/services', label: 'Manajemen Servis', icon: Wrench },
    { href: '/admin/bookings', label: 'Booking Servis', icon: CalendarClock },
    { href: '/admin/work-orders', label: 'Surat Perintah Kerja', icon: FileText },
    { href: '/admin/sales', label: 'Penjualan (POS)', icon: ShoppingCart },
    { href: '/admin/customers', label: 'Pelanggan Servis', icon: Users },
    { href: '/admin/master-data', label: 'Master Data', icon: Database, activePrefixes: MASTER_DATA_PREFIXES },
    { href: '/admin/stock-movements', label: 'Kartu Stok', icon: QrCode, advanced: true },
    { href: '/admin/karyawan', label: 'Data Karyawan', icon: Users },
    { href: '/admin/mechanic-ops', label: 'Operasional Mekanik', icon: UserCheck, roles: ['owner', 'admin'], advanced: true },
    { href: '/admin/reports', label: 'Laporan', icon: BarChart3 },
    { href: '/admin/finance', label: 'Buku Kas & Laba Rugi', icon: Landmark, roles: ['owner', 'admin'], advanced: true },
    { href: '/admin/expenses', label: 'Pengeluaran Bengkel', icon: Wallet, advanced: true },
    { href: '/admin/purchase-orders', label: 'Pengadaan Barang (PO)', icon: ShoppingBag, advanced: true },
    { href: '/admin/returns', label: 'Retur & Refund', icon: RotateCcw, roles: ['owner', 'admin', 'cashier', 'purchasing'], advanced: true },
    { href: '/admin/warranty-claims', label: 'Klaim Garansi', icon: ShieldCheck, advanced: true },
    { href: '/admin/crm/follow-ups', label: 'CRM Follow-up', icon: UserCheck, advanced: true },
    { href: '/admin/audit-logs', label: 'Audit Log', icon: LockKeyhole, roles: ['owner', 'admin'], advanced: true },
    { href: '/admin/branches-warehouses', label: 'Cabang & Gudang', icon: Building2, roles: ['owner', 'admin'], advanced: true },
    { href: '/admin/backups', label: 'Backup & Restore', icon: Archive, roles: ['owner', 'admin'] },
    { href: '/admin/pro/notifications', label: 'Notifikasi Otomatis', icon: Bell, pro: true },
    { href: '/admin/pro/digital-payments', label: 'Pembayaran Digital', icon: CreditCard, pro: true },
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
    const [simpleMode, setSimpleMode] = useState(() => {
        const saved = localStorage.getItem('admin_simple_mode');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('admin_simple_mode', JSON.stringify(simpleMode));
    }, [simpleMode]);

    const isActive = (item) => {
        const href = typeof item === 'string' ? item : item.href;
        const prefixes = typeof item === 'object' ? item.activePrefixes : null;
        if (prefixes?.length) {
            return prefixes.some((prefix) => url === prefix || url?.startsWith(`${prefix}/`) || url?.startsWith(`${prefix}?`));
        }
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
    }, [url]);

    const pageTitle = title || 'Dashboard';

    return (
        <div className="admin-layout-container">
            <DocumentIcons />
            {mobileOpen && (
                <div
                    className="admin-mobile-overlay"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
                <div className="admin-sidebar-brand">
                    <CompanyBranding collapsed={collapsed} />
                </div>

                <nav className="admin-nav">
                    {navItems.filter(canSee).map((item) => {
                        const active = isActive(item);
                        return (
                            <Link
                                key={item.href}
                                href={item.href === '/admin/master-data' ? '/admin/suppliers' : item.href}
                                className={`admin-nav-link${active ? ' is-active' : ''}`}
                            >
                                <item.icon size={20} strokeWidth={active ? 2 : 1.75} style={{ flexShrink: 0 }} />
                                {!collapsed && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                                        <span>{item.label}</span>
                                        {item.pro && (
                                            <span style={{
                                                fontSize: '0.68rem',
                                                fontWeight: 700,
                                                color: 'var(--color-warning)',
                                                border: '1px solid rgba(217,119,6,0.35)',
                                                borderRadius: '6px',
                                                padding: '0.08rem 0.4rem',
                                                letterSpacing: '0.02em',
                                            }}>
                                                PRO
                                            </span>
                                        )}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="admin-sidebar-footer">
                    {!collapsed ? (
                        <button
                            type="button"
                            onClick={() => setSimpleMode(!simpleMode)}
                            className="admin-nav-link"
                            style={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                background: simpleMode ? 'var(--color-primary-alpha)' : 'transparent',
                                border: '1px dashed var(--color-border)',
                                cursor: 'pointer',
                                color: simpleMode ? 'var(--color-primary)' : 'var(--color-sidebar-text)',
                            }}
                        >
                            {simpleMode ? <EyeOff size={18} /> : <Eye size={18} />}
                            <span style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', lineHeight: 1.3 }}>
                                <span style={{ fontWeight: 600 }}>{simpleMode ? 'Mode Sederhana' : 'Mode Lengkap'}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
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
                                border: '1px dashed var(--color-border)',
                                cursor: 'pointer',
                                padding: '0.72rem 0',
                                width: '100%',
                                color: simpleMode ? 'var(--color-primary)' : 'var(--color-sidebar-text)',
                            }}
                            title={simpleMode ? 'Mode Sederhana (Klik untuk Mode Lengkap)' : 'Mode Lengkap (Klik untuk Mode Sederhana)'}
                        >
                            {simpleMode ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
            </aside>

            <div className="admin-main-content">
                <header className="admin-header">
                    <div className="admin-header-left">
                        <button
                            type="button"
                            className="mobile-only admin-header-icon-btn"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Buka menu"
                        >
                            <Menu size={20} strokeWidth={2} />
                        </button>
                        <button
                            type="button"
                            className="desktop-only admin-header-icon-btn"
                            onClick={() => setCollapsed(!collapsed)}
                            aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
                        >
                            <Menu size={20} strokeWidth={2} />
                        </button>

                        <h1 className="admin-header-title">{pageTitle}</h1>
                    </div>

                    <div className="admin-header-right">
                        <ThemeToggle />
                        <Link href="/admin/profile" className="admin-header-user" title="Pengaturan Profil">
                            <strong>{user?.name || 'Administrator'}</strong>
                            <span>Edit profil</span>
                        </Link>
                        <Link
                            href="/admin/logout"
                            method="post"
                            as="button"
                            title="Logout"
                            className="admin-header-logout"
                        >
                            <LogOut size={16} strokeWidth={2.25} />
                        </Link>
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
