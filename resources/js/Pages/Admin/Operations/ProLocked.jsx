import React from 'react';
import { Head } from '@inertiajs/react';
import { Lock, Sparkles } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function ProLocked({ feature, events = [] }) {
    return (
        <AdminLayout title={feature?.label || 'Fitur Pro'}>
            <Head title={feature?.label || 'Fitur Pro'} />

            <div style={{ maxWidth: '860px', display: 'grid', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <Lock size={22} style={{ color: 'var(--color-warning)' }} />
                        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>{feature?.label}</h2>
                        <span style={{ padding: '0.2rem 0.5rem', borderRadius: '999px', background: 'rgba(245,158,11,0.14)', color: 'var(--color-warning)', fontSize: '0.72rem', fontWeight: 800 }}>
                            PRO
                        </span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                        {feature?.description}
                    </p>
                    <button type="button" className="btn btn-outline" disabled style={{ marginTop: '1rem', opacity: 0.65, cursor: 'not-allowed', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Sparkles size={16} /> Aktifkan Paket Pro
                    </button>
                </div>

                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>Yang akan tersedia di layanan Pro</h3>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {events.map(item => (
                            <div key={item} style={{ padding: '0.65rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
