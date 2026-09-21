import React from 'react';
import { Link } from '@inertiajs/react';

const TABS = [
    { id: 'daftar', href: '/admin/sales', label: 'Daftar Kasir' },
    { id: 'kasir', href: '/admin/sales/create', label: 'Kasir' },
    { id: 'kasir-v2', href: '/admin/sales/v2', label: 'Kasir v2' },
    { id: 'piutang', href: '/admin/sales/v2/piutang', label: 'Piutang' },
    { id: 'riwayat', href: '/admin/sales/v2/riwayat', label: 'Riwayat' },
];

export default function PosTabs({ active }) {
    return (
        <nav className="pos-tabs" aria-label="Navigasi penjualan">
            {TABS.map((tab) => (
                <Link
                    key={tab.id}
                    href={tab.href}
                    className={`pos-tab${active === tab.id ? ' is-active' : ''}`}
                >
                    {tab.label}
                </Link>
            ))}
        </nav>
    );
}
