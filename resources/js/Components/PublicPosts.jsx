import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

export const TYPE_LABELS = { berita: 'Berita', promo: 'Promo', informasi: 'Informasi' };

export function formatPostDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function PostTypeBadge({ type }) {
    return (
        <span className={`lp-type-badge lp-type-badge--${type || 'informasi'}`}>
            {TYPE_LABELS[type] || type}
        </span>
    );
}

export function PostCard({ post, featured = false, compact = false }) {
    return (
        <Link
            href={`/konten/${post.slug}`}
            className={`lp-post-card${featured ? ' is-featured' : ''}${compact ? ' is-compact' : ''}`}
        >
            {post.cover_url ? (
                <img src={post.cover_url} alt="" className="lp-post-thumb" />
            ) : (
                <span className="lp-post-thumb lp-post-thumb--empty" aria-hidden="true" />
            )}
            <div className="lp-post-card-body">
                <div className="lp-post-card-meta">
                    <PostTypeBadge type={post.type} />
                    <span className="lp-post-date">{formatPostDate(post.published_at)}</span>
                </div>
                <h3>{post.title}</h3>
                {post.excerpt ? <p>{post.excerpt}</p> : null}
                <span className="lp-post-more">
                    Baca selengkapnya <ArrowUpRight size={15} strokeWidth={2} />
                </span>
            </div>
        </Link>
    );
}
