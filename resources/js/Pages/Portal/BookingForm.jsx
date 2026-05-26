import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PortalLayout from '../../Layouts/PortalLayout';
import { ArrowLeft, Car } from 'lucide-react';

export default function BookingForm({ customer, vehicles }) {
    const { data, setData, post, processing, errors } = useForm({
        vehicle_id: vehicles?.[0]?.id || '',
        service_name: '',
        description: '',
        scheduled_at: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/portal/bookings');
    };

    // Get tomorrow's date string for input min attribute (YYYY-MM-DDTHH:MM)
    const getMinDateTime = () => {
        const now = new Date();
        now.setDate(now.getDate() + 1); // Set to tomorrow
        now.setHours(8, 0, 0, 0); // Set to 08:00 AM
        return now.toISOString().slice(0, 16);
    };

    return (
        <PortalLayout customer={customer}>
            <Head title="Booking Servis Baru" />

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link href="/portal/dashboard"
                            style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ArrowLeft size={14} /> Kembali ke Dashboard
                        </Link>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>
                            Ajukan Booking Servis AC
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                            Jadwalkan perawatan AC mobil Anda secara online. Admin kami akan segera melakukan verifikasi antrean.
                        </p>
                    </div>

                    {vehicles?.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-md)' }}>
                            <Car size={32} style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }} />
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Belum Ada Kendaraan Terdaftar</div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 1rem' }}>
                                Anda harus mendaftarkan minimal 1 kendaraan terlebih dahulu untuk melakukan booking.
                            </p>
                            <Link href="/portal/vehicles/create" className="btn btn-primary" style={{ fontSize: '0.8rem', display: 'inline-flex', textDecoration: 'none' }}>
                                + Daftarkan Kendaraan Sekarang
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="form-label" style={{ color: 'var(--color-text-main)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>
                                    Pilih Kendaraan <span style={{ color: 'var(--color-danger)' }}>*</span>
                                </label>
                                <select
                                    value={data.vehicle_id}
                                    onChange={e => setData('vehicle_id', e.target.value)}
                                    className="form-input"
                                    required
                                >
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {v.brand} {v.model} ({v.license_plate})
                                        </option>
                                    ))}
                                </select>
                                {errors.vehicle_id && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.vehicle_id}</div>}
                            </div>

                            <div>
                                <label className="form-label" style={{ color: 'var(--color-text-main)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>
                                    Rencana Jasa Servis <span style={{ color: 'var(--color-danger)' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.service_name}
                                    onChange={e => setData('service_name', e.target.value)}
                                    className="form-input"
                                    placeholder="Contoh: Cuci AC mobil, Isi Freon, AC tidak dingin"
                                    required
                                />
                                {errors.service_name && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.service_name}</div>}
                            </div>

                            <div>
                                <label className="form-label" style={{ color: 'var(--color-text-main)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>
                                    Rencana Waktu Kedatangan <span style={{ color: 'var(--color-danger)' }}>*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.scheduled_at}
                                    onChange={e => setData('scheduled_at', e.target.value)}
                                    className="form-input"
                                    min={getMinDateTime()}
                                    required
                                />
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'block' }}>
                                    * Booking minimal diajukan H+1 dari hari ini. Jam operasional bengkel: 08:00 - 17:00.
                                </span>
                                {errors.scheduled_at && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.scheduled_at}</div>}
                            </div>

                            <div>
                                <label className="form-label" style={{ color: 'var(--color-text-main)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>
                                    Keluhan AC Kendaraan <span style={{ color: 'var(--color-danger)' }}>*</span>
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="form-input"
                                    rows="4"
                                    placeholder="Gambarkan secara detail keluhan AC mobil Anda (misal: AC hanya keluar angin, kompresor bunyi berisik, dll)"
                                    required
                                ></textarea>
                                {errors.description && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.description}</div>}
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button type="submit" className="btn btn-primary" disabled={processing} style={{ flex: 1 }}>
                                    {processing ? 'Mengirimkan...' : 'Ajukan Booking Servis'}
                                </button>
                                <Link href="/portal/dashboard" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                    Batal
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </PortalLayout>
    );
}
