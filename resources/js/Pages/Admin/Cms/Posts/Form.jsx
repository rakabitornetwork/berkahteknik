import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../../Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';

const TYPE_LABELS = { berita: 'Berita', promo: 'Promo', informasi: 'Informasi' };

function slugify(text) {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function PostForm({ post, types }) {
    const isEditing = !!post;

    const { data, setData, post: submitPost, put, processing, errors } = useForm({
        title: post?.title || '',
        slug: post?.slug || '',
        type: post?.type || 'berita',
        excerpt: post?.excerpt || '',
        body: post?.body || '',
        is_published: post?.is_published ?? false,
        published_at: post?.published_at ? post.published_at.slice(0, 16) : '',
        sort_order: post?.sort_order ?? 0,
        cover: null,
    });

    const [slugTouched, setSlugTouched] = React.useState(!!post?.slug);

    useEffect(() => {
        if (!slugTouched && data.title) {
            setData('slug', slugify(data.title));
        }
    }, [data.title, slugTouched]);

    const submit = (e) => {
        e.preventDefault();
        const opts = { forceFormData: true };
        if (isEditing) {
            put(`/admin/cms/posts/${post.id}`, opts);
        } else {
            submitPost('/admin/cms/posts', opts);
        }
    };

    return (
        <AdminLayout title={isEditing ? 'Edit Konten' : 'Tambah Konten'}>
            <Head title={isEditing ? 'Edit Konten' : 'Tambah Konten'} />

            <div style={{ maxWidth: 640 }}>
                <Link href="/admin/cms/posts" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem', textDecoration: 'none' }}>
                    <ArrowLeft size={14} /> Kembali
                </Link>

                <form onSubmit={submit} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label className="form-label">Judul <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                        <input className="form-input" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                        {errors.title && <Err msg={errors.title} />}
                    </div>

                    <div>
                        <label className="form-label">Slug URL</label>
                        <input className="form-input" value={data.slug} onChange={(e) => { setSlugTouched(true); setData('slug', e.target.value); }} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
                        {errors.slug && <Err msg={errors.slug} />}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Tipe</label>
                            <select className="form-input" value={data.type} onChange={(e) => setData('type', e.target.value)}>
                                {types.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Urutan</label>
                            <input type="number" min={0} className="form-input" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="form-label">Ringkasan</label>
                        <textarea className="form-input" rows={2} value={data.excerpt} onChange={(e) => setData('excerpt', e.target.value)} maxLength={500} />
                    </div>

                    <div>
                        <label className="form-label">Isi</label>
                        <textarea className="form-input" rows={10} value={data.body} onChange={(e) => setData('body', e.target.value)} />
                    </div>

                    <div>
                        <label className="form-label">Gambar sampul</label>
                        {post?.cover_url && <img src={post.cover_url} alt="" style={{ maxHeight: 100, marginBottom: '0.5rem', borderRadius: 'var(--radius-md)' }} />}
                        <input type="file" accept="image/*" className="form-input" onChange={(e) => setData('cover', e.target.files[0] || null)} />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} />
                        Publikasikan
                    </label>

                    {data.is_published && (
                        <div>
                            <label className="form-label">Tanggal terbit</label>
                            <input type="datetime-local" className="form-input" value={data.published_at} onChange={(e) => setData('published_at', e.target.value)} />
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" disabled={processing} style={{ alignSelf: 'flex-start' }}>
                        {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan Konten')}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

function Err({ msg }) {
    return <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{msg}</div>;
}
