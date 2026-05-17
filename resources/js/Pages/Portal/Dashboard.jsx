import React from 'react';
import { Head } from '@inertiajs/react';
import PortalLayout from '../../Layouts/PortalLayout';
import StatusBadge from '../../Components/StatusBadge';

export default function Dashboard({ auth, myServices }) {
    // Dummy data
    const services = myServices?.length > 0 ? myServices : [
        { id: 1042, vehicle: 'Toyota Avanza (B 1234 CD)', status: 'Dikerjakan', description: 'Ganti Freon dan Kompresor AC', start_date: '17 Mei 2026', estimate: 'Rp 1.500.000' }
    ];

    return (
        <PortalLayout user={auth?.user}>
            <Head title="Portal Pelanggan" />

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>Selamat Datang, {auth?.user?.name || 'Pelanggan'}!</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Pantau status perbaikan AC mobil Anda secara real-time dari sini.</p>
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Riwayat & Status Servis</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {services.map((service, idx) => (
                        <div key={idx} className="glass-panel hover-lift" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{service.vehicle}</h3>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>No. Antrian: #{service.id.toString().padStart(4, '0')} &bull; Masuk: {service.start_date}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Status Saat Ini</div>
                                    <StatusBadge status={service.status} />
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Keluhan / Tindakan</div>
                                    <div style={{ marginTop: '0.25rem' }}>{service.description}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Estimasi Biaya</div>
                                    <div style={{ marginTop: '0.25rem', fontWeight: 600, fontSize: '1.125rem' }}>{service.estimate}</div>
                                </div>
                            </div>
                            
                            {service.status === 'Selesai' && (
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--color-border)', textAlign: 'center' }}>
                                    <button className="btn btn-primary" style={{ width: '100%' }}>Unduh Invoice/Garansi</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </PortalLayout>
    );
}
