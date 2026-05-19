import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import PublicLayout from '../../../Layouts/PublicLayout';

const TYPE_LABELS = { berita: 'Berita', promo: 'Promo', informasi: 'Informasi' };

function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function PostShow({ post }) {
    return (
        <PublicLayout>
            <Head title={post.title} />

            <article style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.25rem 3rem' }}>
                <Link href="/konten" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Kembali ke daftar
                </Link>

                <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                    {TYPE_LABELS[post.type]}
                </span>
                <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, margin: '0.5rem 0', lineHeight: 1.2 }}>{post.title}</h1>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{formatDate(post.published_at)}</p>

                {post.cover_url && (
                    <img src={post.cover_url} alt="" style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }} />
                )}

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div
                        className="post-body"
                        style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--color-text-muted)', whiteSpace: 'pre-line' }}
                    >
                        {post.body}
                    </div>
                </div>
            </article>
        </PublicLayout>
    );
}
