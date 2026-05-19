import React from 'react';
import { usePage } from '@inertiajs/react';
import { Fan } from 'lucide-react';

export default function CompanyBranding({ variant = 'default', collapsed = false, className = '' }) {
    const shop = usePage().props.shop || {};
    const name = shop.short_name || shop.app_name || 'AC Berkah';

    if (variant === 'portal') {
        return (
            <div className={`company-branding company-branding--portal ${className}`.trim()} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {shop.logo_url ? (
                    <img src={shop.logo_url} alt={name} style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'contain' }} />
                ) : (
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>
                        AC
                    </div>
                )}
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>{name}</span>
            </div>
        );
    }

    return (
        <div className={`company-branding ${className}`.trim()} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            {shop.logo_url ? (
                <img src={shop.logo_url} alt={name} style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain', flexShrink: 0 }} />
            ) : (
                <span style={{ color: '#fbbf24', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <Fan size={22} strokeWidth={2.5} />
                </span>
            )}
            {!collapsed && (
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff', whiteSpace: 'nowrap' }}>{name}</span>
            )}
        </div>
    );
}
