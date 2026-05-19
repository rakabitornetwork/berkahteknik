import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../../Layouts/AdminLayout';
import Pagination from '../../../../Components/Pagination';
import { Edit, Trash2 } from 'lucide-react';

const TYPE_LABELS = { berita: 'Berita', promo: 'Promo', informasi: 'Informasi' };

export default function PostsIndex({ posts, filters, types }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/cms/posts', { ...filters, search }, { preserveState: true });
    };

    const setFilter = (key, value) => {
        router.get('/admin/cms/posts', { ...filters, [key]: value || undefined, search: filters.search }, { preserveState: true });
    };

    return (
        <AdminLayout title="Berita & Promo">
            <Head title="Berita & Promo" />

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <h2 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Konten Situs</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Link href="/admin/cms/landing" className="btn btn-outline" style={{ fontSize: '0.875rem' }}>Landing Page</Link>
                        <Link href="/admin/cms/posts/create" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>+ Tambah Konten</Link>
                    </div>
                </div>

                <form onSubmit={handleSearch} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input value={search} onChange={(e) => setSearch(e.target.value)} className="form-input" placeholder="Cari judul..." style={{ minWidth: 180, flex: 1 }} />
                    <select className="form-input" value={filters.type || ''} onChange={(e) => setFilter('type', e.target.value)} style={{ width: 'auto' }}>
                        <option value="">Semua tipe</option>
                        {types.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                    </select>
                    <select className="form-input" value={filters.status || ''} onChange={(e) => setFilter('status', e.target.value)} style={{ width: 'auto' }}>
                        <option value="">Semua status</option>
                        <option value="published">Terbit</option>
                        <option value="draft">Draft</option>
                    </select>
                    <button type="submit" className="btn btn-outline">Cari</button>
                </form>

                <div style={{ overflowX: 'auto' }}>
                    <table className="hd-table">
                        <thead>
                            <tr>
                                <th>Judul</th>
                                <th>Tipe</th>
                                <th>Status</th>
                                <th>Tanggal</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.data?.length > 0 ? posts.data.map((post) => (
                                <tr key={post.id}>
                                    <td style={{ fontWeight: 500 }}>{post.title}</td>
                                    <td>{TYPE_LABELS[post.type]}</td>
                                    <td>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: post.is_published ? 'var(--color-success)' : 'var(--color-text-muted)',
                                        }}>
                                            {post.is_published ? 'Terbit' : 'Draft'}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                        {post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID') : '—'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link href={`/admin/cms/posts/${post.id}/edit`} style={{ color: 'var(--color-text-muted)' }} title="Edit"><Edit size={18} /></Link>
                                            <button type="button" onClick={() => { if (confirm('Hapus konten ini?')) router.delete(`/admin/cms/posts/${post.id}`); }}
                                                style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 0 }} title="Hapus">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>Belum ada konten.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={posts.links} />
            </div>
        </AdminLayout>
    );
}
