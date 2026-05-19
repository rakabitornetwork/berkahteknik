import React from 'react';
import { usePage } from '@inertiajs/react';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

export default function AppFooter({ variant = 'portal' }) {
    const shop = usePage().props.shop || {};
    const year = new Date().getFullYear();
    const footerLine = shop.footer_text || `© ${year} ${shop.legal_name || shop.app_name || 'Berkah Teknik AC'}`;

    if (variant === 'admin') {
        return (
            <footer className="app-footer app-footer--admin" style={{ borderTop: '1px solid var(--color-border)', padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                {footerLine}
            </footer>
        );
    }

    return (
        <footer className="app-footer" style={{ borderTop: '1px solid var(--color-border)', padding: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
            <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{shop.legal_name || shop.app_name}</div>
                {shop.tagline && <p style={{ margin: 0 }}>{shop.tagline}</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                    {shop.address && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <MapPin size={14} />
                            {shop.maps_url ? (
                                <a href={shop.maps_url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{shop.address}</a>
                            ) : shop.address}
                        </span>
                    )}
                    {shop.phone && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Phone size={14} /> {shop.phone}
                        </span>
                    )}
                    {shop.whatsapp_url && (
                        <a href={shop.whatsapp_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'inherit' }}>
                            <MessageCircle size={14} /> WhatsApp
                        </a>
                    )}
                    {shop.email && (
                        <a href={`mailto:${shop.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'inherit' }}>
                            <Mail size={14} /> {shop.email}
                        </a>
                    )}
                </div>
                <p style={{ margin: 0 }}>{footerLine}</p>
            </div>
        </footer>
    );
}
