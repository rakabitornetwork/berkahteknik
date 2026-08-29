import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Newspaper } from 'lucide-react';
import PublicLayout from '../../../Layouts/PublicLayout';
import { PostCard, TYPE_LABELS } from '../../../Components/PublicPosts';

export default function PostsIndex({ posts, filters, types }) {
    const setType = (type) => {
        router.get('/konten', type ? { type } : {}, { preserveState: true, preserveScroll: true });
    };

    const items = posts.data || [];
    const useBoard = (posts.current_page || 1) === 1 && items.length > 1;
    const featured = useBoard ? items[0] : null;
    const sidePosts = useBoard ? items.slice(1, 3) : [];
    const rest = useBoard ? items.slice(3) : items;
    const total = posts.total ?? items.length;

    return (
        <PublicLayout variant="editorial">
            <Head title="Berita & Promo" />

            <div className="lp">
                <section className="lp-page-hero">
                    <div className="lp-hero-shade" />
                    <div className="lp-hero-grain" />
                    <div className="lp-page-hero-inner">
                        <p className="lp-kicker">Wawasan bengkel</p>
                        <h1>Berita & Promo</h1>
                        <p>Update layanan, penawaran, dan informasi resmi dari bengkel — dirancang agar mudah dibaca sebelum Anda booking.</p>
                    </div>
                </section>

                <section className="lp-section" style={{ paddingTop: '2.75rem' }}>
                    <div className="lp-section-inner">
                        <div className="lp-page-toolbar">
                            <div className="lp-filter-bar">
                                <button
                                    type="button"
                                    className={`lp-filter-chip${!filters.type ? ' is-active' : ''}`}
                                    onClick={() => setType(null)}
                                >
                                    Semua
                                </button>
                                {types.map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        className={`lp-filter-chip${filters.type === t ? ' is-active' : ''}`}
                                        onClick={() => setType(t)}
                                    >
                                        {TYPE_LABELS[t]}
                                    </button>
                                ))}
                            </div>
                            <p className="lp-page-count">
                                {total} {total === 1 ? 'tulisan' : 'tulisan'}
                            </p>
                        </div>

                        {items.length === 0 ? (
                            <div className="lp-empty">
                                <div className="lp-empty-icon">
                                    <Newspaper size={22} strokeWidth={1.7} />
                                </div>
                                <h2>Belum ada konten</h2>
                                <p>Berita, promo, atau informasi belum dipublikasikan untuk kategori ini.</p>
                            </div>
                        ) : (
                            <>
                                {featured && (
                                    <div className={`lp-post-board${sidePosts.length ? ' has-side' : ''}`}>
                                        <PostCard post={featured} featured />
                                        {sidePosts.length > 0 && (
                                            <div className="lp-post-side">
                                                {sidePosts.map((post) => (
                                                    <PostCard key={post.id} post={post} compact />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {rest.length > 0 && (
                                    <div className="lp-post-grid" style={{ marginTop: featured ? '1.15rem' : 0 }}>
                                        {rest.map((post) => (
                                            <PostCard key={post.id} post={post} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {posts.last_page > 1 && (
                            <nav className="lp-pager" aria-label="Navigasi halaman">
                                {posts.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={link.active ? 'is-active' : undefined}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="is-disabled"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </nav>
                        )}
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
