import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Crosshair, Loader2, MapPin, Save, Settings } from 'lucide-react';
import ThermalPrinterSettings from '../../../Components/ThermalPrinterSettings';

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--color-border)',
            }}>
                {title}
            </h3>
            {children}
        </div>
    );
}

function FieldError({ message }) {
    if (!message) return null;
    return (
        <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{message}</div>
    );
}

function Alert({ type, children }) {
    const isError = type === 'error';
    return (
        <div style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            background: isError ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)',
            color: isError ? 'var(--color-danger)' : 'var(--color-success)',
            border: `1px solid ${isError ? 'rgba(239, 68, 68, 0.35)' : 'rgba(34, 197, 94, 0.35)'}`,
        }}>
            {children}
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="form-label">{label}</label>
            {children}
            <FieldError message={error} />
        </div>
    );
}

function Grid({ cols, children }) {
    return (
        <div style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: cols === 2 ? '1fr 1fr' : '1fr',
        }}>
            {children}
        </div>
    );
}

function GpsToolbar({ gpsLoading, processing, onCapture, mapsPreview }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <button
                type="button"
                className="btn btn-outline"
                onClick={onCapture}
                disabled={gpsLoading || processing}
                style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
                {gpsLoading ? <Loader2 size={16} className="spin" /> : <Crosshair size={16} />}
                {gpsLoading ? 'Mengambil lokasi...' : 'Ambil Lokasi GPS Saat Ini'}
            </button>
            {mapsPreview && (
                <a href={mapsPreview} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} /> Buka di Google Maps
                </a>
            )}
        </div>
    );
}

export default function SettingsEdit({ settings }) {
    const { shop, flash } = usePage().props;
    const [gpsLoading, setGpsLoading] = useState(false);
    const [gpsError, setGpsError] = useState(null);
    const [gpsSuccess, setGpsSuccess] = useState(null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        app_name: settings.app_name || '',
        legal_name: settings.legal_name || '',
        short_name: settings.short_name || '',
        tagline: settings.tagline || '',
        owner_name: settings.owner_name || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        website: settings.website || '',
        address: settings.address || '',
        latitude: settings.latitude ?? '',
        longitude: settings.longitude ?? '',
        footer_text: settings.footer_text || '',
        receipt_footer: settings.receipt_footer || '',
        warranty_policy: settings.warranty_policy || '',
        warranty_default_months: settings.warranty_default_months ?? 3,
        logo: null,
        favicon: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/settings', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const captureGps = () => {
        setGpsError(null);
        setGpsSuccess(null);

        if (!navigator.geolocation) {
            setGpsError('Browser tidak mendukung GPS. Isi latitude/longitude secara manual.');
            return;
        }

        setGpsLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = Number(position.coords.latitude.toFixed(7));
                const lng = Number(position.coords.longitude.toFixed(7));
                setData('latitude', lat);
                setData('longitude', lng);
                setGpsLoading(false);
                setGpsSuccess(`Koordinat diterapkan: ${lat}, ${lng} (akurasi ±${Math.round(position.coords.accuracy)} m)`);
            },
            (err) => {
                setGpsLoading(false);
                const messages = {
                    1: 'Izin lokasi ditolak. Aktifkan izin lokasi untuk situs ini di browser.',
                    2: 'Lokasi tidak tersedia. Pastikan GPS perangkat aktif.',
                    3: 'Waktu habis saat mengambil lokasi. Coba lagi.',
                };
                setGpsError(messages[err.code] || 'Gagal mengambil lokasi GPS.');
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
        );
    };

    const mapsPreview = data.latitude && data.longitude
        ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
        : null;

    const mapsEmbed = data.latitude && data.longitude
        ? `https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=16&output=embed`
        : null;

    return (
        <AdminLayout title="Pengaturan Aplikasi">
            <Head title="Pengaturan Aplikasi" />

            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Settings size={22} /> Pengaturan Aplikasi
                    </h2>
                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        Data ini dipakai di navbar, footer, nota cetak, dan SPK.
                    </p>
                </div>

                {(flash?.success || recentlySuccessful) && (
                    <Alert type="success">{flash?.success || 'Pengaturan berhasil disimpan.'}</Alert>
                )}

                {errors.message && <Alert type="error">{errors.message}</Alert>}

                <form onSubmit={submit} className="glass-panel" style={{ padding: '1.5rem' }}>
                    <Section title="Identitas & Pemilik">
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <Field label="Nama Aplikasi" error={errors.app_name}>
                                <input className="form-input" value={data.app_name} onChange={e => setData('app_name', e.target.value)} required />
                            </Field>
                            <Field label="Nama Legal / Nota" error={errors.legal_name}>
                                <input className="form-input" value={data.legal_name} onChange={e => setData('legal_name', e.target.value)} required />
                            </Field>
                            <Field label="Nama Singkat (Navbar)" error={errors.short_name}>
                                <input className="form-input" value={data.short_name} onChange={e => setData('short_name', e.target.value)} required />
                            </Field>
                            <Field label="Tagline">
                                <input className="form-input" value={data.tagline} onChange={e => setData('tagline', e.target.value)} />
                            </Field>
                            <Field label="Nama Pemilik">
                                <input className="form-input" value={data.owner_name} onChange={e => setData('owner_name', e.target.value)} />
                            </Field>
                        </div>
                    </Section>

                    <Section title="Kontak">
                        <Grid cols={2}>
                            <Field label="Telepon">
                                <input className="form-input" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                            </Field>
                            <Field label="WhatsApp">
                                <input className="form-input" value={data.whatsapp} onChange={e => setData('whatsapp', e.target.value)} placeholder="08xxxxxxxxxx" />
                            </Field>
                            <Field label="Email" error={errors.email}>
                                <input type="email" className="form-input" value={data.email} onChange={e => setData('email', e.target.value)} />
                            </Field>
                            <Field label="Website">
                                <input className="form-input" value={data.website} onChange={e => setData('website', e.target.value)} />
                            </Field>
                        </Grid>
                    </Section>

                    <Section title="Lokasi (GPS)">
                        <GpsSection
                            data={data}
                            setData={setData}
                            errors={errors}
                            gpsLoading={gpsLoading}
                            processing={processing}
                            captureGps={captureGps}
                            mapsPreview={mapsPreview}
                            mapsEmbed={mapsEmbed}
                            gpsError={gpsError}
                            gpsSuccess={gpsSuccess}
                        />
                    </Section>

                    <Section title="Logo & Ikon">
                        <Grid cols={2}>
                            <Field label="Logo" error={errors.logo}>
                                {shop?.logo_url && <img src={shop.logo_url} alt="Logo" style={{ display: 'block', maxHeight: 48, marginBottom: '0.5rem' }} />}
                                <input type="file" accept="image/*" className="form-input" onChange={e => setData('logo', e.target.files[0] || null)} />
                            </Field>
                            <Field label="Favicon / Ikon" error={errors.favicon}>
                                {shop?.favicon_url && <img src={shop.favicon_url} alt="Favicon" style={{ display: 'block', maxHeight: 32, marginBottom: '0.5rem' }} />}
                                <input type="file" accept="image/*" className="form-input" onChange={e => setData('favicon', e.target.files[0] || null)} />
                            </Field>
                        </Grid>
                    </Section>

                    <Section title="Printer Thermal Bluetooth">
                        <ThermalPrinterSettings />
                    </Section>

                    <Section title="Footer & Nota">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Field label="Teks Footer (Portal/Admin)">
                                <textarea className="form-input" rows={2} value={data.footer_text} onChange={e => setData('footer_text', e.target.value)} />
                            </Field>
                            <Field label="Teks Footer Nota Cetak">
                                <textarea className="form-input" rows={2} value={data.receipt_footer} onChange={e => setData('receipt_footer', e.target.value)} />
                            </Field>
                        </div>
                    </Section>

                    <Section title="Kebijakan Garansi (Umum)">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Field label="Masa Garansi Default (bulan)" error={errors.warranty_default_months}>
                                <input type="number" min={0} max={120} className="form-input" value={data.warranty_default_months} onChange={e => setData('warranty_default_months', e.target.value)} />
                            </Field>
                            <Field label="Kebijakan Garansi">
                                <textarea className="form-input" rows={5} value={data.warranty_policy} onChange={e => setData('warranty_policy', e.target.value)} />
                            </Field>
                        </div>
                    </Section>

                    <button type="submit" className="btn btn-primary" disabled={processing} style={{ width: '100%', marginTop: '0.5rem' }}>
                        <Save size={16} style={{ marginRight: '0.35rem' }} />
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .spin { animation: spin 0.8s linear infinite; }
            `}</style>
        </AdminLayout>
    );
}

function GpsSection({ data, setData, errors, gpsLoading, processing, captureGps, mapsPreview, mapsEmbed, gpsError, gpsSuccess }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Field label="Alamat Lengkap">
                <textarea className="form-input" rows={2} value={data.address} onChange={e => setData('address', e.target.value)} />
            </Field>

            <GpsToolbar gpsLoading={gpsLoading} processing={processing} onCapture={captureGps} mapsPreview={mapsPreview} />

            {gpsError && <Alert type="error">{gpsError}</Alert>}
            {gpsSuccess && <Alert type="success">{gpsSuccess}</Alert>}

            <Grid cols={2}>
                <Field label="Latitude" error={errors.latitude}>
                    <input type="number" step="any" className="form-input" value={data.latitude} onChange={e => setData('latitude', e.target.value)} placeholder="-6.200000" />
                </Field>
                <Field label="Longitude" error={errors.longitude}>
                    <input type="number" step="any" className="form-input" value={data.longitude} onChange={e => setData('longitude', e.target.value)} placeholder="106.816666" />
                </Field>
            </Grid>

            {mapsEmbed && (
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <iframe
                        title="Preview lokasi bengkel"
                        src={mapsEmbed}
                        width="100%"
                        height="220"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            )}
        </div>
    );
}
