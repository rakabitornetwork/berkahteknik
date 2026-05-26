import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PortalLayout from '../../Layouts/PortalLayout';
import { ArrowLeft } from 'lucide-react';

export default function VehicleForm({ customer }) {
    const { data, setData, post, processing, errors } = useForm({
        license_plate: '',
        brand: '',
        model: '',
        year: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/portal/vehicles');
    };

    return (
        <PortalLayout customer={customer}>
            <Head title="Tambah Kendaraan Baru" />

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link href="/portal/dashboard"
                            style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ArrowLeft size={14} /> Kembali ke Dashboard
                        </Link>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>
                            Daftarkan Kendaraan Baru
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                            Daftarkan mobil Anda agar bisa melakukan pengajuan booking servis secara online.
                        </p>
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="form-label" style={{ color: 'var(--color-text-main)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>
                                Plat Nomor <span style={{ color: 'var(--color-danger)' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={data.license_plate}
                                onChange={e => setData('license_plate', e.target.value.toUpperCase())}
                                className="form-input"
                                placeholder="Contoh: B 1234 CD"
                                style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em' }}
                                required
                            />
                            {errors.license_plate && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.license_plate}</div>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="form-label" style={{ color: 'var(--color-text-main)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>
                                    Merek Mobil <span style={{ color: 'var(--color-danger)' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.brand}
                                    onChange={e => setData('brand', e.target.value)}
                                    className="form-input"
                                    placeholder="Contoh: Toyota / Honda"
                                    required
                                />
                                {errors.brand && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.brand}</div>}
                            </div>
                            <div>
                                <label className="form-label" style={{ color: 'var(--color-text-main)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>
                                    Model / Tipe <span style={{ color: 'var(--color-danger)' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.model}
                                    onChange={e => setData('model', e.target.value)}
                                    className="form-input"
                                    placeholder="Contoh: Avanza / Jazz"
                                    required
                                />
                                {errors.model && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.model}</div>}
                            </div>
                        </div>

                        <div>
                            <label className="form-label" style={{ color: 'var(--color-text-main)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>
                                Tahun Pembuatan
                            </label>
                            <input
                                type="number"
                                value={data.year}
                                onChange={e => setData('year', e.target.value)}
                                className="form-input"
                                placeholder="Contoh: 2018"
                                min={1990}
                                max={new Date().getFullYear() + 1}
                            />
                            {errors.year && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.year}</div>}
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={processing} style={{ flex: 1 }}>
                                {processing ? 'Menyimpan...' : 'Daftarkan Kendaraan'}
                            </button>
                            <Link href="/portal/dashboard" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </PortalLayout>
    );
}
