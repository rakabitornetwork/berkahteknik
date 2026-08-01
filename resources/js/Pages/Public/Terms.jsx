import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Terms() {
    const shop = usePage().props.shop || {};
    const brand = shop.short_name || shop.legal_name || shop.app_name || 'Bengkel AC';

    return (
        <PublicLayout>
            <Head title="Terms of Service" />

            <article style={{ maxWidth: 720, margin: '0 auto', padding: '2.5rem 1.25rem 3.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-primary)', margin: '0 0 0.75rem' }}>
                    Legal
                </p>
                <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', fontWeight: 700, margin: '0 0 0.75rem', lineHeight: 1.2 }}>
                    Terms of Service
                </h1>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                    Syarat dan ketentuan penggunaan situs serta layanan {brand}. Dengan mengakses situs atau portal pelanggan, Anda menyetujui ketentuan berikut.
                </p>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem', fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
                    <section>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-main)', margin: '0 0 0.4rem' }}>1. Layanan</h2>
                        <p style={{ margin: 0 }}>
                            Situs ini menyediakan informasi bengkel, berita/promo, serta akses portal pelanggan untuk booking dan pelacakan servis AC kendaraan. Informasi di situs bersifat umum dan dapat berubah sewaktu-waktu.
                        </p>
                    </section>
                    <section>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-main)', margin: '0 0 0.4rem' }}>2. Akun portal</h2>
                        <p style={{ margin: 0 }}>
                            Anda bertanggung jawab menjaga kerahasiaan kredensial akun. Data yang Anda kirim (kendaraan, keluhan, booking) harus akurat. Penyalahgunaan akun dapat mengakibatkan pembatasan akses.
                        </p>
                    </section>
                    <section>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-main)', margin: '0 0 0.4rem' }}>3. Booking & jadwal</h2>
                        <p style={{ margin: 0 }}>
                            Pengajuan booking bersifat permintaan jadwal dan belum menjamin slot final hingga dikonfirmasi bengkel. Bengkel berhak menyesuaikan waktu servis sesuai kapasitas operasional.
                        </p>
                    </section>
                    <section>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-main)', margin: '0 0 0.4rem' }}>4. Garansi & klaim</h2>
                        <p style={{ margin: 0 }}>
                            Garansi mengikuti kebijakan yang berlaku pada saat servis selesai. Klaim hanya diproses untuk pekerjaan yang tercakup dan dalam masa berlaku garansi, dengan syarat kerusakan tidak disebabkan penyalahgunaan atau modifikasi pihak ketiga.
                        </p>
                    </section>
                    <section>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-main)', margin: '0 0 0.4rem' }}>5. Privasi data</h2>
                        <p style={{ margin: 0 }}>
                            Data pelanggan digunakan untuk operasional servis, komunikasi terkait pekerjaan, dan peningkatan layanan. Kami tidak menjual data pribadi kepada pihak ketiga untuk tujuan pemasaran tanpa persetujuan.
                        </p>
                    </section>
                    <section>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-main)', margin: '0 0 0.4rem' }}>6. Perubahan ketentuan</h2>
                        <p style={{ margin: 0 }}>
                            Ketentuan ini dapat diperbarui tanpa pemberitahuan terpisah. Versi terbaru selalu tersedia di halaman ini. Penggunaan berkelanjutan setelah pembaruan dianggap sebagai penerimaan.
                        </p>
                    </section>
                </div>

                <p style={{ marginTop: '1.75rem' }}>
                    <Link href="/" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
                        ← Kembali ke beranda
                    </Link>
                </p>
            </article>
        </PublicLayout>
    );
}
