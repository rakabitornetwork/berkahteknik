import React from 'react';
import { usePage } from '@inertiajs/react';

export default function CompanyBranding({ variant = 'default', collapsed = false, className = '' }) {
    const shop = usePage().props.shop || {};
    const name = shop.app_name || shop.legal_name || 'Berkah Teknik AC';
    const initial = name.slice(0, 2).toUpperCase();

    if (variant === 'portal') {
        return (
            <div className={`company-branding company-branding--portal ${className}`.trim()} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {shop.logo_url ? (
                    <img src={shop.logo_url} alt={name} style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'contain' }} />
                ) : (
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'linear-gradient(145deg, var(--color-primary-light), var(--color-primary) 55%, var(--color-primary-dark))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                    }}>
                        {initial}
                    </div>
                )}
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--color-text-main)' }}>{name}</span>
            </div>
        );
    }

    return (
        <div className={`company-branding ${className}`.trim()} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden', width: '100%' }}>
            {shop.logo_url ? (
                <img src={shop.logo_url} alt={name} style={{ width: 34, height: 34, borderRadius: 10, objectFit: 'contain', flexShrink: 0 }} />
            ) : (
                <div
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: 'linear-gradient(145deg, #14948a, #0f766e 55%, #0b5f59)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        flexShrink: 0,
                    }}
                    aria-hidden="true"
                >
                    {initial}
                </div>
            )}
            {!collapsed && (
                <span
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        fontSize: '1.05rem',
                        letterSpacing: '-0.02em',
                        color: 'var(--color-sidebar-active-text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {name}
                </span>
            )}
        </div>
    );
}
