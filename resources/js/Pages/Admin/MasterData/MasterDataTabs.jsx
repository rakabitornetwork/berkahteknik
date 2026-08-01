import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Truck, Package, Tags, ClipboardList, Briefcase, Store } from 'lucide-react';

const tabs = [
    { href: '/admin/suppliers', label: 'Data Supplier', icon: Truck, match: (p) => p.startsWith('/admin/suppliers') },
    { href: '/admin/spare-parts', label: 'Data Produk', icon: Package, match: (p) => p.startsWith('/admin/spare-parts') },
    { href: '/admin/product-types', label: 'Kategori Produk', icon: Tags, match: (p) => p.startsWith('/admin/product-types') },
    { href: '/admin/work-types', label: 'Data Jasa', icon: ClipboardList, match: (p) => p.startsWith('/admin/work-types') },
    { href: '/admin/service-categories', label: 'Kategori Jasa', icon: Briefcase, match: (p) => p.startsWith('/admin/service-categories') },
    { href: '/admin/master-data/pelanggan-sparepart', label: 'Pelanggan Sparepart', icon: Store, match: (p) => p.startsWith('/admin/master-data/pelanggan-sparepart') },
];

export default function MasterDataTabs() {
    const { url } = usePage();
    const path = url.split('?')[0];

    return (
        <div style={{
            display: 'flex',
            gap: '0.45rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '0.75rem',
        }}>
            {tabs.map((tab) => {
                const active = tab.match(path);
                const Icon = tab.icon;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.45rem 0.8rem',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            fontWeight: active ? 700 : 500,
                            color: active ? '#fff' : 'var(--color-text-muted)',
                            background: active ? 'var(--color-primary)' : 'transparent',
                            border: active ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                        }}
                    >
                        <Icon size={14} />
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}

export const MASTER_DATA_PREFIXES = [
    '/admin/suppliers',
    '/admin/spare-parts',
    '/admin/product-types',
    '/admin/work-types',
    '/admin/service-categories',
    '/admin/master-data',
];
