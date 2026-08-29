import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import PublicLayout from '../../../Layouts/PublicLayout';
import { PostCard, PostTypeBadge, formatPostDate } from '../../../Components/PublicPosts';

export default function PostShow({ post, related = [] }) {
    return (
        <PublicLayout variant="editorial">
            <Head title={post.title} />

            <div className="lp">
                <article className="lp-article">
                    <div className="lp-article-inner">
                        <Link href="/konten" className="lp-article-back">
                            <ArrowLeft size={16} strokeWidth={2} /> Kembali ke Berita & Promo
                        </Link>

                        <header className="lp-article-head">
                            <div className="lp-post-card-meta">
                                <PostTypeBadge type={post.type} />
                                <span className="lp-post-date">{formatPostDate(post.published_at)}</span>
                            </div>
                            <h1>{post.title}</h1>
                            {post.excerpt ? <p className="lp-lead" style={{ margin: 0 }}>{post.excerpt}</p> : null}
                        </header>

                        {post.cover_url && (
                            <div className="lp-article-cover">
                                <img src={post.cover_url} alt="" />
                            </div>
                        )}

                        <div className="lp-article-body">{post.body}</div>

                        {related.length > 0 && (
                            <aside className="lp-related">
                                <h2>Tulisan terkait</h2>
                                <div className="lp-post-grid">
                                    {related.map((item) => (
                                        <PostCard key={item.id} post={item} />
                                    ))}
                                </div>
                            </aside>
                        )}
                    </div>
                </article>
            </div>
        </PublicLayout>
    );
}
