import React from 'react';
import { Link } from '@inertiajs/react';

const TABS = [
    { id: 'daftar', href: '/admin/sales', label: 'Daftar Kasir' },
    { id: 'kasir', href: '/admin/sales/create', label: 'Kasir' },
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
