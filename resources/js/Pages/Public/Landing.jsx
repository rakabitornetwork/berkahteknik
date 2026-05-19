import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Car, Home, Package, MapPin, Phone, MessageCircle, Mail } from 'lucide-react';
import PublicLayout, { portalCtaUrl } from '../../Layouts/PublicLayout';

const TYPE_LABELS = { berita: 'Berita', promo: 'Promo', informasi: 'Informasi' };
const ICONS = { car: Car, home: Home, package: Package };

function ServiceIcon({ name }) {
    const Icon = ICONS[name] || Package;
    return <Icon size={22} />;
}

function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Landing({ landing, latestPosts }) {
    const { shop, auth } = usePage().props;
    const ctaUrl = portalCtaUrl(auth, landing?.hero_cta_url);
    const ctaLabel = landing?.hero_cta_label || 'Lacak Servis Kendaraan';

    return (
        <PublicLayout>
            <Head title={shop?.app_name || 'Bengkel AC'} />

            <section className="landing-hero">
                <div className="landing-hero-inner" style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.25rem 4rem', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2.5rem', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                            {shop?.tagline || 'Bengkel AC Terpercaya'}
                        </p>
                        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                            {landing?.hero_title || shop?.legal_name}
                        </h1>
                        <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.65, marginBottom: '1.75rem', maxWidth: '32rem' }}>
                            {landing?.hero_subtitle}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <Link href={ctaUrl} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}>
                                {ctaLabel} <ArrowRight size={18} />
                            </Link>
                            <Link href="/konten" className="btn btn-outline" style={{ padding: '0.65rem 1.25rem' }}>
                                Berita & Promo
                            </Link>
                        </div>
                    </div>
                    {landing?.hero_image_url ? (
                        <img src={landing.hero_image_url} alt="" style={{ width: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', maxHeight: 360, border: '1px solid var(--color-border)' }} />
                    ) : (
                        <div className="glass-panel" style={{ aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                            <FanPlaceholder />
                        </div>
                    )}
                </div>
            </section>

            {landing?.services?.length > 0 && (
                <section style={{ padding: '3rem 1.25rem', borderTop: '1px solid var(--color-border)' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>Layanan Kami</h2>
                        <div className="landing-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                            {landing.services.map((svc, i) => (
                                <div key={i} className="glass-panel" style={{ padding: '1.25rem' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                                        <ServiceIcon name={svc.icon} />
                                    </div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>{svc.title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.55, margin: 0 }}>{svc.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {(landing?.about_title || landing?.about_body) && (
                <section style={{ padding: '3rem 1.25rem', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: landing?.about_image_url ? '1fr 1fr' : '1fr', gap: '2rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>{landing.about_title}</h2>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{landing.about_body}</div>
                        </div>
                        {landing.about_image_url && (
                            <img src={landing.about_image_url} alt="" style={{ width: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', maxHeight: 320, border: '1px solid var(--color-border)' }} />
                        )}
                    </div>
                </section>
            )}

            {landing?.show_latest_posts && latestPosts?.length > 0 && (
                <section style={{ padding: '3rem 1.25rem', borderTop: '1px solid var(--color-border)' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>Berita & Informasi Terbaru</h2>
                            <Link href="/konten" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 500 }}>Lihat semua →</Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                            {latestPosts.map((post) => (
                                <Link key={post.id} href={`/konten/${post.slug}`} className="glass-panel" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', display: 'block', transition: 'border-color var(--transition-fast)' }}>
                                    {post.cover_url && (
                                        <img src={post.cover_url} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                                    )}
                                    <div style={{ padding: '1rem' }}>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-primary)' }}>{TYPE_LABELS[post.type]}</span>
                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0.35rem 0', color: 'var(--color-text-main)' }}>{post.title}</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {post.excerpt}
                                        </p>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>{formatDate(post.published_at)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="landing-cta-band" style={{ padding: '3rem 1.25rem', borderTop: '1px solid var(--color-border)' }}>
                <div className="glass-panel" style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Pantau Servis Kendaraan Anda</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                        Login ke portal pelanggan untuk melihat status perbaikan AC mobil secara real-time.
                    </p>
                    <Link href={ctaUrl} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        {ctaLabel} <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            <section style={{ padding: '2rem 1.25rem 3rem' }}>
                <div className="glass-panel" style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Hubungi Kami</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        {shop?.address && (
                            <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                <MapPin size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                                {shop.maps_url ? <a href={shop.maps_url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>{shop.address}</a> : shop.address}
                            </span>
                        )}
                        {shop?.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> {shop.phone}</span>}
                        {shop?.whatsapp_url && (
                            <a href={shop.whatsapp_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)' }}>
                                <MessageCircle size={16} /> WhatsApp
                            </a>
                        )}
                        {shop?.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {shop.email}</span>}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

function FanPlaceholder() {
    return (
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}
