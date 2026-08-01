import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Users, Briefcase, Wallet } from 'lucide-react';

const tabs = [
    { href: '/admin/karyawan', label: 'Data Karyawan', icon: Users, match: (url) => url === '/admin/karyawan' || url.startsWith('/admin/karyawan?') },
    { href: '/admin/karyawan/jabatan', label: 'Data Jabatan', icon: Briefcase, match: (url) => url.startsWith('/admin/karyawan/jabatan') },
    { href: '/admin/karyawan/gaji', label: 'Gaji Karyawan', icon: Wallet, match: (url) => url.startsWith('/admin/karyawan/gaji') },
];

export default function EmployeeTabs() {
    const { url } = usePage();
    const path = url.split('?')[0];

    return (
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '0.75rem',
        }}>
            {tabs.map((tab) => {
                const active = tab.match(path) || tab.match(url);
                const Icon = tab.icon;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.5rem 0.9rem',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            fontWeight: active ? 700 : 500,
                            color: active ? '#fff' : 'var(--color-text-muted)',
                            background: active ? 'var(--color-primary)' : 'transparent',
                            border: active ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                        }}
                    >
                        <Icon size={15} />
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}
