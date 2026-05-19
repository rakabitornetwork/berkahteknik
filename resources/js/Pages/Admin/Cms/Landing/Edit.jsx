import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Save, Trash2 } from 'lucide-react';
import AdminLayout from '../../../../Layouts/AdminLayout';

const defaultService = () => ({ title: '', description: '', icon: 'package' });

export default function LandingEdit({ settings, landing }) {
    const services = landing?.services?.length ? landing.services : [defaultService()];

    const { data, setData, put, processing, errors } = useForm({
        landing_hero_title: settings.landing_hero_title || '',
        landing_hero_subtitle: settings.landing_hero_subtitle || '',
        landing_hero_cta_label: settings.landing_hero_cta_label || 'Lacak Servis Kendaraan',
        landing_hero_cta_url: settings.landing_hero_cta_url || '/portal/login',
        landing_about_title: settings.landing_about_title || '',
        landing_about_body: settings.landing_about_body || '',
        landing_services_json: services,
        landing_show_latest_posts: settings.landing_show_latest_posts ?? true,
        landing_posts_limit: settings.landing_posts_limit ?? 6,
        hero_image: null,
        about_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        put('/admin/cms/landing', { forceFormData: true });
    };

    const updateService = (index, field, value) => {
        const next = [...data.landing_services_json];
        next[index] = { ...next[index], [field]: value };
        setData('landing_services_json', next);
    };

    const addService = () => {
        if (data.landing_services_json.length >= 8) return;
        setData('landing_services_json', [...data.landing_services_json, defaultService()]);
    };

    const removeService = (index) => {
        setData('landing_services_json', data.landing_services_json.filter((_, i) => i !== index));
    };

    return (
        <AdminLayout title="Landing Page">
            <Head title="Landing Page" />

            <div style={{ maxWidth: 720 }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                    Kelola tampilan halaman utama situs (/) yang dapat dilihat pengunjung.
                </p>

                <form onSubmit={submit} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <section>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Hero</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Field label="Judul utama" error={errors.landing_hero_title}>
                                <input className="form-input" value={data.landing_hero_title} onChange={(e) => setData('landing_hero_title', e.target.value)} />
                            </Field>
                            <Field label="Subjudul" error={errors.landing_hero_subtitle}>
                                <textarea className="form-input" rows={2} value={data.landing_hero_subtitle} onChange={(e) => setData('landing_hero_subtitle', e.target.value)} />
                            </Field>
                            <Field label="Gambar hero">
                                {landing?.hero_image_url && <img src={landing.hero_image_url} alt="" style={{ maxHeight: 80, marginBottom: '0.5rem', borderRadius: 'var(--radius-md)' }} />}
                                <input type="file" accept="image/*" className="form-input" onChange={(e) => setData('hero_image', e.target.files[0] || null)} />
                            </Field>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <Field label="Teks tombol CTA" error={errors.landing_hero_cta_label}>
                                    <input className="form-input" value={data.landing_hero_cta_label} onChange={(e) => setData('landing_hero_cta_label', e.target.value)} />
                                </Field>
                                <Field label="URL tombol CTA" error={errors.landing_hero_cta_url}>
                                    <input className="form-input" value={data.landing_hero_cta_url} onChange={(e) => setData('landing_hero_cta_url', e.target.value)} placeholder="/portal/login" />
                                </Field>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Tentang</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Field label="Judul" error={errors.landing_about_title}>
                                <input className="form-input" value={data.landing_about_title} onChange={(e) => setData('landing_about_title', e.target.value)} />
                            </Field>
                            <Field label="Isi" error={errors.landing_about_body}>
                                <textarea className="form-input" rows={5} value={data.landing_about_body} onChange={(e) => setData('landing_about_body', e.target.value)} />
                            </Field>
                            <Field label="Gambar">
                                {landing?.about_image_url && <img src={landing.about_image_url} alt="" style={{ maxHeight: 80, marginBottom: '0.5rem', borderRadius: 'var(--radius-md)' }} />}
                                <input type="file" accept="image/*" className="form-input" onChange={(e) => setData('about_image', e.target.files[0] || null)} />
                            </Field>
                        </div>
                    </section>

                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>Layanan</h3>
                            <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }} onClick={addService}>
                                <Plus size={14} /> Tambah
                            </button>
                        </div>
                        {data.landing_services_json.map((svc, i) => (
                            <div key={i} className="glass-panel" style={{ padding: '1rem', marginBottom: '0.75rem', border: '1px solid var(--color-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                                    {data.landing_services_json.length > 1 && (
                                        <button type="button" onClick={() => removeService(i)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    <input className="form-input" placeholder="Judul layanan" value={svc.title} onChange={(e) => updateService(i, 'title', e.target.value)} />
                                    <textarea className="form-input" rows={2} placeholder="Deskripsi" value={svc.description} onChange={(e) => updateService(i, 'description', e.target.value)} />
                                    <select className="form-input" value={svc.icon || 'package'} onChange={(e) => updateService(i, 'icon', e.target.value)}>
                                        <option value="car">Mobil</option>
                                        <option value="home">Rumah</option>
                                        <option value="package">Spare part</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Berita di landing</h3>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '0.75rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={data.landing_show_latest_posts} onChange={(e) => setData('landing_show_latest_posts', e.target.checked)} />
                            Tampilkan postingan terbaru di halaman utama
                        </label>
                        <Field label="Jumlah postingan" error={errors.landing_posts_limit}>
                            <input type="number" min={1} max={12} className="form-input" style={{ maxWidth: 100 }} value={data.landing_posts_limit} onChange={(e) => setData('landing_posts_limit', e.target.value)} />
                        </Field>
                    </section>

                    <button type="submit" className="btn btn-primary" disabled={processing} style={{ alignSelf: 'flex-start' }}>
                        <Save size={16} style={{ marginRight: '0.35rem' }} />
                        {processing ? 'Menyimpan...' : 'Simpan Landing Page'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="form-label">{label}</label>
            {children}
            {error && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{error}</div>}
        </div>
    );
}
