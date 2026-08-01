import React, { useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight, Car, Package, MapPin, Phone, MessageCircle, Mail,
    Wrench, Shield, Clock, Snowflake, CheckCircle2, Thermometer, Fan,
} from 'lucide-react';
import PublicLayout, { portalCtaUrl } from '../../Layouts/PublicLayout';

const TYPE_LABELS = { berita: 'Berita', promo: 'Promo', informasi: 'Informasi' };
const ICONS = {
    car: Car,
    package: Package,
    wrench: Wrench,
    shield: Shield,
    clock: Clock,
    snowflake: Snowflake,
    check: CheckCircle2,
    thermometer: Thermometer,
    fan: Fan,
};

function ServiceIcon({ name, size = 20 }) {
    const Icon = ICONS[name] || Package;
    return <Icon size={size} strokeWidth={1.5} className="lp-service-icon" />;
}

function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function useReveal() {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('is-visible');
                    io.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
        );

        io.observe(el);
        return () => io.disconnect();
    }, []);

    return ref;
}

function Reveal({ className = '', children }) {
    const ref = useReveal();
    return (
        <div ref={ref} className={`lp-reveal ${className}`.trim()}>
            {children}
        </div>
    );
}

function SectionHead({ copy, fallbackKicker, fallbackTitle, fallbackLead }) {
    const kicker = copy?.kicker || fallbackKicker;
    const title = copy?.title || fallbackTitle;
    const lead = copy?.lead ?? fallbackLead;

    return (
        <div className="lp-section-head">
            {kicker && <p className="lp-kicker">{kicker}</p>}
            {title && <h2 className="lp-h2">{title}</h2>}
            {lead ? <p className="lp-lead">{lead}</p> : null}
        </div>
    );
}

export default function Landing({ landing, latestPosts }) {
    const { shop, auth } = usePage().props;
    const brand = shop?.legal_name || shop?.app_name || 'Bengkel AC';
    const sections = landing?.sections || {};
    const copy = landing?.copy || {};

    const heroCtaUrl = portalCtaUrl(auth, landing?.hero_cta_url);
    const heroCtaLabel = landing?.hero_cta_label || 'Lacak Servis Kendaraan';
    const bandCtaUrl = portalCtaUrl(auth, landing?.cta_url || landing?.hero_cta_url);
    const bandCtaLabel = landing?.cta_label || heroCtaLabel;

    const heroTitle = landing?.hero_title || shop?.tagline || 'Servis AC profesional & terpercaya';
    const heroSub = landing?.hero_subtitle || 'Perawatan dan perbaikan AC mobil dengan standar kerja rapi, transparan, dan bergaransi.';

    const showHighlights = sections.highlights !== false && landing?.highlights?.length > 0;
    const showServices = sections.services !== false && landing?.services?.length > 0;
    const showProcess = sections.process !== false && landing?.process?.length > 0;
    const showAbout = sections.about !== false && (landing?.about_title || landing?.about_body);
    const showWarranty = sections.warranty !== false && (landing?.warranty_title || landing?.warranty_body);
    const showTestimonials = sections.testimonials !== false && landing?.testimonials?.length > 0;
    const showHours = sections.hours !== false && landing?.hours?.length > 0;
    const showPosts = sections.posts !== false && landing?.show_latest_posts && latestPosts?.length > 0;
    const showCta = sections.cta !== false;
    const showContact = sections.contact !== false && (shop?.address || shop?.phone || shop?.whatsapp_url || shop?.email);

    useEffect(() => {
        if (window.location.hash !== '#berita-promo') return undefined;
        const timer = window.setTimeout(() => {
            document.getElementById('berita-promo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
        return () => window.clearTimeout(timer);
    }, [showPosts]);

    return (
        <PublicLayout variant="landing">
            <Head title={shop?.app_name || 'Bengkel AC'} />

            <div className="lp">
                <section className="lp-hero" aria-label="Beranda">
                    <div className="lp-hero-media" aria-hidden="true">
                        <img
                            src={landing?.hero_image_url}
                            alt=""
                            width={3840}
                            height={2560}
                            decoding="async"
                            fetchPriority="high"
                        />
                    </div>
                    <div className="lp-hero-inner">
                        <div className="lp-hero-copy">
                            <p className="lp-brand">{brand}</p>
                            <h1 className="lp-hero-title">{heroTitle}</h1>
                            <p className="lp-hero-sub">{heroSub}</p>
                            <div className="lp-cta-group">
                                <Link href={heroCtaUrl} className="lp-btn lp-btn-primary">
                                    {heroCtaLabel} <ArrowRight size={18} strokeWidth={2} />
                                </Link>
                                <a
                                    href="#berita-promo"
                                    className="lp-btn lp-btn-ghost"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('berita-promo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                >
                                    Berita & Promo
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {showHighlights && (
                    <section className="lp-section lp-highlights">
                        <div className="lp-section-inner">
                            <Reveal>
                                <SectionHead copy={copy.highlights} fallbackKicker="Keunggulan" fallbackTitle="Mengapa memilih bengkel kami" />
                            </Reveal>
                            <Reveal>
                                <div className="lp-highlight-grid">
                                    {landing.highlights.map((item, i) => (
                                        <article key={i} className="lp-highlight-item">
                                            <ServiceIcon name={item.icon} size={22} />
                                            <h3>{item.title}</h3>
                                            <p>{item.description}</p>
                                        </article>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </section>
                )}

                {showServices && (
                    <section className="lp-section lp-services">
                        <div className="lp-section-inner">
                            <Reveal>
                                <SectionHead copy={copy.services} fallbackKicker="Layanan" fallbackTitle="Keahlian yang kami andalkan" />
                            </Reveal>
                            <Reveal>
                                <ul className="lp-service-list">
                                    {landing.services.map((svc, i) => (
                                        <li key={i} className="lp-service-item">
                                            <ServiceIcon name={svc.icon} size={24} />
                                            <div className="lp-service-body">
                                                <h3>{svc.title}</h3>
                                                <p>{svc.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </Reveal>
                        </div>
                    </section>
                )}

                {showProcess && (
                    <section className="lp-section lp-process">
                        <div className="lp-section-inner">
                            <Reveal>
                                <SectionHead copy={copy.process} fallbackKicker="Alur servis" fallbackTitle="Proses yang transparan" />
                            </Reveal>
                            <Reveal>
                                <ol className="lp-process-list">
                                    {landing.process.map((step, i) => (
                                        <li key={i} className="lp-process-item">
                                            <span className="lp-process-num">{String(i + 1).padStart(2, '0')}</span>
                                            <div>
                                                <h3>{step.title}</h3>
                                                <p>{step.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </Reveal>
                        </div>
                    </section>
                )}

                {showAbout && (
                    <section className="lp-section lp-about">
                        <div className="lp-section-inner lp-about-grid has-image">
                            <Reveal>
                                <div className="lp-section-head" style={{ marginBottom: '1rem', textAlign: 'left' }}>
                                    <p className="lp-kicker">Tentang kami</p>
                                    <h2 className="lp-h2">{landing.about_title || 'Cerita di balik bengkel'}</h2>
                                </div>
                                <div className="lp-about-body">{landing.about_body}</div>
                            </Reveal>
                            <Reveal>
                                <div className="lp-about-visual">
                                    <img
                                        src={landing.about_image_url}
                                        alt=""
                                        width={3840}
                                        height={2160}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            </Reveal>
                        </div>
                    </section>
                )}

                {showWarranty && (
                    <section className="lp-section lp-warranty">
                        <div className="lp-section-inner lp-warranty-inner">
                            <Reveal>
                                <p className="lp-kicker">Garansi</p>
                                <h2 className="lp-h2">{landing.warranty_title || 'Garansi pekerjaan yang jelas'}</h2>
                                <div className="lp-warranty-body" style={{ marginTop: '1rem' }}>{landing.warranty_body}</div>
                            </Reveal>
                        </div>
                    </section>
                )}

                {showTestimonials && (
                    <section className="lp-section lp-testimonials">
                        <div className="lp-section-inner">
                            <Reveal>
                                <SectionHead copy={copy.testimonials} fallbackKicker="Testimoni" fallbackTitle="Dipercaya pemilik kendaraan" />
                            </Reveal>
                            <Reveal>
                                <div className="lp-testimonial-grid">
                                    {landing.testimonials.map((item, i) => (
                                        <blockquote key={i} className="lp-testimonial-item">
                                            <p>“{item.quote}”</p>
                                            <footer>
                                                <strong>{item.name}</strong>
                                                {item.vehicle ? <span>{item.vehicle}</span> : null}
                                            </footer>
                                        </blockquote>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </section>
                )}

                {showHours && (
                    <section className="lp-section lp-hours">
                        <div className="lp-section-inner lp-hours-grid">
                            <Reveal>
                                <SectionHead copy={copy.hours} fallbackKicker="Jam operasional" fallbackTitle="Kapan kami siap melayani" />
                            </Reveal>
                            <Reveal>
                                <ul className="lp-hours-list">
                                    {landing.hours.map((row, i) => (
                                        <li key={i}>
                                            <span>{row.day}</span>
                                            <strong>{row.time}</strong>
                                        </li>
                                    ))}
                                </ul>
                            </Reveal>
                        </div>
                    </section>
                )}

                {showPosts && (
                    <section id="berita-promo" className="lp-section lp-posts">
                        <div className="lp-section-inner">
                            <Reveal>
                                <div className="lp-posts-head">
                                    <SectionHead copy={copy.posts} fallbackKicker="Wawasan" fallbackTitle="Berita & informasi terbaru" />
                                    <Link href="/konten" className="lp-text-link">Lihat semua</Link>
                                </div>
                            </Reveal>
                            <Reveal>
                                <div className="lp-post-list">
                                    {latestPosts.map((post) => (
                                        <Link key={post.id} href={`/konten/${post.slug}`} className="lp-post-row">
                                            {post.cover_url ? (
                                                <img src={post.cover_url} alt="" className="lp-post-thumb" />
                                            ) : (
                                                <span className="lp-post-thumb lp-post-thumb--empty" aria-hidden="true" />
                                            )}
                                            <div>
                                                <p className="lp-post-meta">{TYPE_LABELS[post.type] || post.type}</p>
                                                <h3>{post.title}</h3>
                                                <p>{post.excerpt}</p>
                                            </div>
                                            <span className="lp-post-date">{formatDate(post.published_at)}</span>
                                        </Link>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </section>
                )}

                {showCta && (
                    <section className="lp-section lp-cta-band">
                        <div className="lp-section-inner">
                            <Reveal>
                                <p className="lp-kicker">Portal pelanggan</p>
                                <h2 className="lp-h2">{landing.cta_title || 'Pantau progres servis secara langsung'}</h2>
                                <p className="lp-lead">
                                    {landing.cta_body || 'Masuk ke portal untuk melihat status perbaikan, riwayat kendaraan, dan pembaruan dari bengkel.'}
                                </p>
                            </Reveal>
                            <Reveal>
                                <Link href={bandCtaUrl} className="lp-btn lp-btn-primary">
                                    {bandCtaLabel} <ArrowRight size={18} />
                                </Link>
                            </Reveal>
                        </div>
                    </section>
                )}

                {showContact && (
                    <section className="lp-section lp-contact">
                        <div className="lp-section-inner">
                            <Reveal>
                                <div className="lp-section-head">
                                    <p className="lp-kicker">Kontak</p>
                                    <h2 className="lp-h2">{landing.contact_title || 'Hubungi kami'}</h2>
                                    <p className="lp-lead">
                                        {landing.contact_lead || 'Siap membantu konsultasi, booking, dan pertanyaan seputar servis AC mobil.'}
                                    </p>
                                </div>
                            </Reveal>
                            <Reveal>
                                <div className="lp-contact-grid">
                                    {shop?.address && (
                                        <div className="lp-contact-item">
                                            <MapPin size={18} strokeWidth={1.5} />
                                            <div>
                                                <strong>Alamat</strong>
                                                {shop.maps_url ? (
                                                    <a href={shop.maps_url} target="_blank" rel="noreferrer">{shop.address}</a>
                                                ) : (
                                                    <span>{shop.address}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {shop?.phone && (
                                        <div className="lp-contact-item">
                                            <Phone size={18} strokeWidth={1.5} />
                                            <div>
                                                <strong>Telepon</strong>
                                                <span>{shop.phone}</span>
                                            </div>
                                        </div>
                                    )}
                                    {shop?.whatsapp_url && (
                                        <div className="lp-contact-item">
                                            <MessageCircle size={18} strokeWidth={1.5} />
                                            <div>
                                                <strong>WhatsApp</strong>
                                                <a href={shop.whatsapp_url} target="_blank" rel="noreferrer">Chat sekarang</a>
                                            </div>
                                        </div>
                                    )}
                                    {shop?.email && (
                                        <div className="lp-contact-item">
                                            <Mail size={18} strokeWidth={1.5} />
                                            <div>
                                                <strong>Email</strong>
                                                <a href={`mailto:${shop.email}`}>{shop.email}</a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Reveal>
                        </div>
                    </section>
                )}
            </div>
        </PublicLayout>
    );
}
