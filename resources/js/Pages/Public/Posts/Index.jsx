import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';

const TYPE_LABELS = { berita: 'Berita', promo: 'Promo', informasi: 'Informasi' };

function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function PostsIndex({ posts, filters, types }) {
    const setType = (type) => {
        router.get('/konten', type ? { type } : {}, { preserveState: true });
    };

    return (
        <PublicLayout>
            <Head title="Berita & Promo" />

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.25rem 3rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>Berita & Promo</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Informasi terbaru seputar layanan dan promo bengkel kami.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <button
                        type="button"
                        className={!filters.type ? 'btn btn-primary' : 'btn btn-outline'}
                        style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
                        onClick={() => setType(null)}
                    >
                        Semua
                    </button>
                    {types.map((t) => (
                        <button
                            key={t}
                            type="button"
                            className={filters.type === t ? 'btn btn-primary' : 'btn btn-outline'}
                            style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
                            onClick={() => setType(t)}
                        >
                            {TYPE_LABELS[t]}
                        </button>
                    ))}
                </div>

                {posts.data.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        Belum ada konten yang dipublikasikan.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {posts.data.map((post) => (
                            <Link key={post.id} href={`/konten/${post.slug}`} className="glass-panel" style={{ overflow: 'hidden', textDecoration: 'none', display: 'block' }}>
                                {post.cover_url && (
                                    <img src={post.cover_url} alt="" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                                )}
                                <div style={{ padding: '1.1rem' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                                        {TYPE_LABELS[post.type]}
                                    </span>
                                    <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: '0.4rem 0 0.5rem', color: 'var(--color-text-main)' }}>{post.title}</h2>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.55 }}>{post.excerpt}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.65rem' }}>{formatDate(post.published_at)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {posts.last_page > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                        {posts.links.map((link, i) => (
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={link.active ? 'btn btn-primary' : 'btn btn-outline'}
                                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', opacity: link.url ? 1 : 0.5 }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span key={i} className="btn btn-outline" style={{ fontSize: '0.8rem', opacity: 0.4 }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            )
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
