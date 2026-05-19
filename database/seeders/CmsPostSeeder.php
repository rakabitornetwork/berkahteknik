<?php

namespace Database\Seeders;

use App\Models\CmsPost;
use App\Models\ShopSetting;
use Illuminate\Database\Seeder;

class CmsPostSeeder extends Seeder
{
    public function run(): void
    {
        $shop = ShopSetting::current();

        if (! $shop->landing_hero_title) {
            $shop->update([
                'landing_hero_title' => 'Servis AC Profesional & Terpercaya',
                'landing_hero_subtitle' => 'Perawatan, perbaikan, dan isi freon AC mobil & rumah dengan teknisi berpengalaman.',
                'landing_hero_cta_label' => 'Lacak Servis Kendaraan',
                'landing_hero_cta_url' => '/portal/login',
                'landing_about_title' => 'Tentang Bengkel Kami',
                'landing_about_body' => "Berkah Teknik AC hadir melayani perawatan dan perbaikan AC dengan standar kerja rapi, transparan, dan bergaransi.\n\nPelanggan dapat memantau progres servis kendaraan secara online melalui portal pelanggan.",
                'landing_services_json' => [
                    ['title' => 'Servis AC Mobil', 'description' => 'Cuci evaporator, isi freon, cek kebocoran, dan perbaikan kompresor.', 'icon' => 'car'],
                    ['title' => 'Servis AC Rumah', 'description' => 'Perawatan unit split/standing, pembersihan, dan optimasi pendinginan.', 'icon' => 'home'],
                    ['title' => 'Penjualan Spare Part', 'description' => 'Suku cadang AC original & kompatibel dengan stok terkini.', 'icon' => 'package'],
                ],
                'landing_show_latest_posts' => true,
                'landing_posts_limit' => 6,
            ]);
        }

        if (CmsPost::query()->exists()) {
            return;
        }

        CmsPost::create([
            'title' => 'Promo Servis AC Mobil — Diskon 15%',
            'slug' => 'promo-servis-ac-mobil-diskon-15',
            'type' => 'promo',
            'excerpt' => 'Dapatkan diskon 15% untuk paket servis AC mobil lengkap selama bulan ini.',
            'body' => "Syarat dan ketentuan:\n- Berlaku untuk semua tipe mobil\n- Tidak dapat digabung dengan promo lain\n- Hubungi kami via WhatsApp untuk reservasi",
            'is_published' => true,
            'published_at' => now(),
            'sort_order' => 10,
        ]);

        CmsPost::create([
            'title' => 'Tips Merawat AC Agar Awet dan Dingin',
            'slug' => 'tips-merawat-ac-agar-awet',
            'type' => 'berita',
            'excerpt' => 'Beberapa kebiasaan sederhana yang membantu AC mobil dan rumah tetap optimal.',
            'body' => "1. Rutin servis setiap 6 bulan\n2. Bersihkan filter AC secara berkala\n3. Hindari pengaturan suhu terlalu ekstrem\n4. Segera periksa jika AC kurang dingin atau berbau",
            'is_published' => true,
            'published_at' => now()->subDay(),
            'sort_order' => 5,
        ]);

        CmsPost::create([
            'title' => 'Jam Operasional Bengkel',
            'slug' => 'jam-operasional-bengkel',
            'type' => 'informasi',
            'excerpt' => 'Informasi jam buka dan layanan booking servis.',
            'body' => "Senin – Sabtu: 08.00 – 17.00 WIB\nMinggu: Tutup\n\nUntuk antrian lebih cepat, silakan daftar melalui portal pelanggan atau WhatsApp.",
            'is_published' => true,
            'published_at' => now()->subDays(2),
            'sort_order' => 0,
        ]);
    }
}
