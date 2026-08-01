import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Save, Trash2 } from 'lucide-react';
import AdminLayout from '../../../../Layouts/AdminLayout';

const emptyService = () => ({ title: '', description: '', icon: 'car' });
const emptyHighlight = () => ({ title: '', description: '', icon: 'wrench' });
const emptyProcess = () => ({ title: '', description: '' });
const emptyTestimonial = () => ({ name: '', vehicle: '', quote: '' });
const emptyHour = () => ({ day: '', time: '' });

const SECTION_LABELS = {
    highlights: 'Keunggulan',
    services: 'Layanan',
    process: 'Alur servis',
    about: 'Tentang',
    warranty: 'Garansi',
    testimonials: 'Testimoni',
    hours: 'Jam operasional',
    posts: 'Berita & promo',
    cta: 'CTA portal',
    contact: 'Kontak',
};

export default function LandingEdit({ settings, landing, defaults }) {
    const icons = defaults?.icons || {};
    const copy = { ...(defaults?.copy || {}), ...(landing?.copy || {}) };
    const sections = { ...(defaults?.sections || {}), ...(landing?.sections || {}) };

    const { data, setData, put, processing, errors } = useForm({
        landing_hero_title: settings.landing_hero_title || '',
        landing_hero_subtitle: settings.landing_hero_subtitle || '',
        landing_hero_cta_label: settings.landing_hero_cta_label || 'Lacak Servis Kendaraan',
        landing_hero_cta_url: settings.landing_hero_cta_url || '/portal/login',
        landing_about_title: settings.landing_about_title || '',
        landing_about_body: settings.landing_about_body || '',
        landing_services_json: landing?.services?.length ? landing.services : [emptyService()],
        landing_highlights_json: landing?.highlights?.length ? landing.highlights : [emptyHighlight()],
        landing_process_json: landing?.process?.length ? landing.process : [emptyProcess()],
        landing_testimonials_json: landing?.testimonials?.length ? landing.testimonials : [emptyTestimonial()],
        landing_hours_json: landing?.hours?.length ? landing.hours : [emptyHour()],
        landing_copy_json: copy,
        landing_sections_json: sections,
        landing_warranty_title: settings.landing_warranty_title || '',
        landing_warranty_body: settings.landing_warranty_body || '',
        landing_cta_title: settings.landing_cta_title || '',
        landing_cta_body: settings.landing_cta_body || '',
        landing_cta_label: settings.landing_cta_label || settings.landing_hero_cta_label || '',
        landing_cta_url: settings.landing_cta_url || settings.landing_hero_cta_url || '/portal/login',
        landing_contact_title: settings.landing_contact_title || '',
        landing_contact_lead: settings.landing_contact_lead || '',
        landing_show_latest_posts: settings.landing_show_latest_posts ?? true,
        landing_posts_limit: settings.landing_posts_limit ?? 6,
        hero_image: null,
        about_image: null,
        remove_hero_image: false,
        remove_about_image: false,
    });

    const submit = (e) => {
        e.preventDefault();
        put('/admin/cms/landing', { forceFormData: true });
    };

    const setSection = (key, value) => {
        setData('landing_sections_json', { ...data.landing_sections_json, [key]: value });
        if (key === 'posts') {
            setData('landing_show_latest_posts', value);
        }
    };

    const setCopy = (key, field, value) => {
        setData('landing_copy_json', {
            ...data.landing_copy_json,
            [key]: { ...(data.landing_copy_json[key] || {}), [field]: value },
        });
    };

    const updateList = (field, index, key, value) => {
        const next = [...data[field]];
        next[index] = { ...next[index], [key]: value };
        setData(field, next);
    };

    const addList = (field, factory, max = 8) => {
        if (data[field].length >= max) return;
        setData(field, [...data[field], factory()]);
    };

    const removeList = (field, index) => {
        setData(field, data[field].filter((_, i) => i !== index));
    };

    return (
        <AdminLayout title="Landing Page">
            <Head title="Landing Page" />

            <div style={{ maxWidth: 820 }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                    Kelola seluruh section halaman utama (/). Aktifkan/nonaktifkan section, lalu sesuaikan konten bengkel AC mobil.
                </p>

                <form onSubmit={submit} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    <Section title="Section yang ditampilkan">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.65rem' }}>
                            {Object.keys(SECTION_LABELS).map((key) => (
                                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={!!data.landing_sections_json[key]}
                                        onChange={(e) => setSection(key, e.target.checked)}
                                    />
                                    {SECTION_LABELS[key]}
                                </label>
                            ))}
                        </div>
                    </Section>

                    <Section title="Hero">
                        <Field label="Judul utama" error={errors.landing_hero_title}>
                            <input className="form-input" value={data.landing_hero_title} onChange={(e) => setData('landing_hero_title', e.target.value)} />
                        </Field>
                        <Field label="Subjudul" error={errors.landing_hero_subtitle}>
                            <textarea className="form-input" rows={2} value={data.landing_hero_subtitle} onChange={(e) => setData('landing_hero_subtitle', e.target.value)} />
                        </Field>
                        <ImageField
                            label="Gambar hero (UHD)"
                            previewUrl={landing?.hero_image_url}
                            isDefault={landing?.hero_image_is_default}
                            file={data.hero_image}
                            onFile={(file) => {
                                setData('hero_image', file);
                                setData('remove_hero_image', false);
                            }}
                            onReset={!landing?.hero_image_is_default ? () => {
                                setData('hero_image', null);
                                setData('remove_hero_image', true);
                            } : null}
                            hint="Disarankan 3840×2160 atau lebih besar (JPG/WebP, maks 12MB). Kosongkan/reset untuk memakai gambar default."
                            markedForReset={data.remove_hero_image}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <Field label="Teks tombol CTA" error={errors.landing_hero_cta_label}>
                                <input className="form-input" value={data.landing_hero_cta_label} onChange={(e) => setData('landing_hero_cta_label', e.target.value)} />
                            </Field>
                            <Field label="URL tombol CTA" error={errors.landing_hero_cta_url}>
                                <input className="form-input" value={data.landing_hero_cta_url} onChange={(e) => setData('landing_hero_cta_url', e.target.value)} />
                            </Field>
                        </div>
                    </Section>

                    <Section title="Keunggulan">
                        <CopyFields blockKey="highlights" data={data} setCopy={setCopy} />
                        <ListEditor
                            items={data.landing_highlights_json}
                            onAdd={() => addList('landing_highlights_json', emptyHighlight)}
                            onRemove={(i) => removeList('landing_highlights_json', i)}
                            renderItem={(item, i) => (
                                <>
                                    <input className="form-input" placeholder="Judul" value={item.title} onChange={(e) => updateList('landing_highlights_json', i, 'title', e.target.value)} />
                                    <textarea className="form-input" rows={2} placeholder="Deskripsi" value={item.description} onChange={(e) => updateList('landing_highlights_json', i, 'description', e.target.value)} />
                                    <IconSelect icons={icons} value={item.icon} onChange={(v) => updateList('landing_highlights_json', i, 'icon', v)} />
                                </>
                            )}
                        />
                    </Section>

                    <Section title="Layanan">
                        <CopyFields blockKey="services" data={data} setCopy={setCopy} />
                        <ListEditor
                            items={data.landing_services_json}
                            onAdd={() => addList('landing_services_json', emptyService)}
                            onRemove={(i) => removeList('landing_services_json', i)}
                            renderItem={(item, i) => (
                                <>
                                    <input className="form-input" placeholder="Judul layanan" value={item.title} onChange={(e) => updateList('landing_services_json', i, 'title', e.target.value)} />
                                    <textarea className="form-input" rows={2} placeholder="Deskripsi" value={item.description} onChange={(e) => updateList('landing_services_json', i, 'description', e.target.value)} />
                                    <IconSelect icons={icons} value={item.icon} onChange={(v) => updateList('landing_services_json', i, 'icon', v)} />
                                </>
                            )}
                        />
                    </Section>

                    <Section title="Alur servis">
                        <CopyFields blockKey="process" data={data} setCopy={setCopy} />
                        <ListEditor
                            items={data.landing_process_json}
                            max={6}
                            onAdd={() => addList('landing_process_json', emptyProcess, 6)}
                            onRemove={(i) => removeList('landing_process_json', i)}
                            renderItem={(item, i) => (
                                <>
                                    <input className="form-input" placeholder={`Langkah ${i + 1}`} value={item.title} onChange={(e) => updateList('landing_process_json', i, 'title', e.target.value)} />
                                    <textarea className="form-input" rows={2} placeholder="Deskripsi langkah" value={item.description} onChange={(e) => updateList('landing_process_json', i, 'description', e.target.value)} />
                                </>
                            )}
                        />
                    </Section>

                    <Section title="Tentang">
                        <Field label="Judul" error={errors.landing_about_title}>
                            <input className="form-input" value={data.landing_about_title} onChange={(e) => setData('landing_about_title', e.target.value)} />
                        </Field>
                        <Field label="Isi" error={errors.landing_about_body}>
                            <textarea className="form-input" rows={5} value={data.landing_about_body} onChange={(e) => setData('landing_about_body', e.target.value)} />
                        </Field>
                        <ImageField
                            label="Gambar tentang (UHD)"
                            previewUrl={landing?.about_image_url}
                            isDefault={landing?.about_image_is_default}
                            file={data.about_image}
                            onFile={(file) => {
                                setData('about_image', file);
                                setData('remove_about_image', false);
                            }}
                            onReset={!landing?.about_image_is_default ? () => {
                                setData('about_image', null);
                                setData('remove_about_image', true);
                            } : null}
                            hint="Disarankan 3840×2160 atau lebih besar (JPG/WebP, maks 12MB)."
                            markedForReset={data.remove_about_image}
                        />
                    </Section>

                    <Section title="Garansi">
                        <Field label="Judul" error={errors.landing_warranty_title}>
                            <input className="form-input" value={data.landing_warranty_title} onChange={(e) => setData('landing_warranty_title', e.target.value)} />
                        </Field>
                        <Field label="Isi kebijakan garansi" error={errors.landing_warranty_body}>
                            <textarea className="form-input" rows={4} value={data.landing_warranty_body} onChange={(e) => setData('landing_warranty_body', e.target.value)} />
                        </Field>
                    </Section>

                    <Section title="Testimoni">
                        <CopyFields blockKey="testimonials" data={data} setCopy={setCopy} />
                        <ListEditor
                            items={data.landing_testimonials_json}
                            onAdd={() => addList('landing_testimonials_json', emptyTestimonial)}
                            onRemove={(i) => removeList('landing_testimonials_json', i)}
                            renderItem={(item, i) => (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        <input className="form-input" placeholder="Nama pelanggan" value={item.name} onChange={(e) => updateList('landing_testimonials_json', i, 'name', e.target.value)} />
                                        <input className="form-input" placeholder="Kendaraan" value={item.vehicle} onChange={(e) => updateList('landing_testimonials_json', i, 'vehicle', e.target.value)} />
                                    </div>
                                    <textarea className="form-input" rows={2} placeholder="Kutipan testimoni" value={item.quote} onChange={(e) => updateList('landing_testimonials_json', i, 'quote', e.target.value)} />
                                </>
                            )}
                        />
                    </Section>

                    <Section title="Jam operasional">
                        <CopyFields blockKey="hours" data={data} setCopy={setCopy} />
                        <ListEditor
                            items={data.landing_hours_json}
                            onAdd={() => addList('landing_hours_json', emptyHour)}
                            onRemove={(i) => removeList('landing_hours_json', i)}
                            renderItem={(item, i) => (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                    <input className="form-input" placeholder="Hari" value={item.day} onChange={(e) => updateList('landing_hours_json', i, 'day', e.target.value)} />
                                    <input className="form-input" placeholder="Jam" value={item.time} onChange={(e) => updateList('landing_hours_json', i, 'time', e.target.value)} />
                                </div>
                            )}
                        />
                    </Section>

                    <Section title="Berita di landing">
                        <CopyFields blockKey="posts" data={data} setCopy={setCopy} />
                        <Field label="Jumlah postingan" error={errors.landing_posts_limit}>
                            <input type="number" min={1} max={12} className="form-input" style={{ maxWidth: 100 }} value={data.landing_posts_limit} onChange={(e) => setData('landing_posts_limit', e.target.value)} />
                        </Field>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                            Section ini mengikuti toggle “Berita & promo” di atas.
                        </p>
                    </Section>

                    <Section title="CTA portal pelanggan">
                        <Field label="Judul" error={errors.landing_cta_title}>
                            <input className="form-input" value={data.landing_cta_title} onChange={(e) => setData('landing_cta_title', e.target.value)} />
                        </Field>
                        <Field label="Deskripsi" error={errors.landing_cta_body}>
                            <textarea className="form-input" rows={2} value={data.landing_cta_body} onChange={(e) => setData('landing_cta_body', e.target.value)} />
                        </Field>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <Field label="Teks tombol" error={errors.landing_cta_label}>
                                <input className="form-input" value={data.landing_cta_label} onChange={(e) => setData('landing_cta_label', e.target.value)} />
                            </Field>
                            <Field label="URL tombol" error={errors.landing_cta_url}>
                                <input className="form-input" value={data.landing_cta_url} onChange={(e) => setData('landing_cta_url', e.target.value)} />
                            </Field>
                        </div>
                    </Section>

                    <Section title="Kontak">
                        <Field label="Judul" error={errors.landing_contact_title}>
                            <input className="form-input" value={data.landing_contact_title} onChange={(e) => setData('landing_contact_title', e.target.value)} />
                        </Field>
                        <Field label="Lead" error={errors.landing_contact_lead}>
                            <textarea className="form-input" rows={2} value={data.landing_contact_lead} onChange={(e) => setData('landing_contact_lead', e.target.value)} />
                        </Field>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                            Data alamat/telepon/WhatsApp/email diambil dari Pengaturan Aplikasi.
                        </p>
                    </Section>

                    <button type="submit" className="btn btn-primary" disabled={processing} style={{ alignSelf: 'flex-start' }}>
                        <Save size={16} style={{ marginRight: '0.35rem' }} />
                        {processing ? 'Menyimpan...' : 'Simpan Landing Page'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

function Section({ title, children }) {
    return (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', margin: 0, borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                {title}
            </h3>
            {children}
        </section>
    );
}

function CopyFields({ blockKey, data, setCopy }) {
    const block = data.landing_copy_json?.[blockKey] || {};
    return (
        <div style={{ display: 'grid', gap: '0.65rem' }}>
            <Field label="Kicker / label kecil">
                <input className="form-input" value={block.kicker || ''} onChange={(e) => setCopy(blockKey, 'kicker', e.target.value)} />
            </Field>
            <Field label="Judul section">
                <input className="form-input" value={block.title || ''} onChange={(e) => setCopy(blockKey, 'title', e.target.value)} />
            </Field>
            <Field label="Lead / deskripsi singkat">
                <textarea className="form-input" rows={2} value={block.lead || ''} onChange={(e) => setCopy(blockKey, 'lead', e.target.value)} />
            </Field>
        </div>
    );
}

function ListEditor({ items, onAdd, onRemove, renderItem, max = 8 }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }} onClick={onAdd} disabled={items.length >= max}>
                    <Plus size={14} /> Tambah
                </button>
            </div>
            {items.map((item, i) => (
                <div key={i} className="glass-panel" style={{ padding: '1rem', marginBottom: '0.75rem', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                        {items.length > 1 && (
                            <button type="button" onClick={() => onRemove(i)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>{renderItem(item, i)}</div>
                </div>
            ))}
        </div>
    );
}

function IconSelect({ icons, value, onChange }) {
    return (
        <select className="form-input" value={value || 'package'} onChange={(e) => onChange(e.target.value)}>
            {Object.entries(icons).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
            ))}
        </select>
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

function ImageField({ label, previewUrl, isDefault, file, onFile, onReset, hint, markedForReset }) {
    const localPreview = file ? URL.createObjectURL(file) : null;
    const shown = localPreview || (!markedForReset ? previewUrl : null);

    return (
        <Field label={label}>
            {shown && (
                <img
                    src={shown}
                    alt=""
                    style={{
                        display: 'block',
                        width: '100%',
                        maxWidth: 420,
                        maxHeight: 180,
                        objectFit: 'cover',
                        marginBottom: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                    }}
                />
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="form-input"
                    style={{ flex: 1, minWidth: 220 }}
                    onChange={(e) => onFile(e.target.files[0] || null)}
                />
                {onReset && (
                    <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={onReset}>
                        Pakai default
                    </button>
                )}
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {markedForReset
                    ? 'Gambar kustom akan diganti kembali ke default saat disimpan.'
                    : isDefault
                        ? `Sedang memakai gambar default. ${hint}`
                        : `Sedang memakai gambar kustom. ${hint}`}
            </p>
        </Field>
    );
}
