<?php

namespace App\Support;

class LandingDefaults
{
    public const HERO_IMAGE = 'images/landing/hero-default.jpg';

    public const ABOUT_IMAGE = 'images/landing/about-default.jpg';

    public static function heroImageUrl(): string
    {
        return asset(self::HERO_IMAGE);
    }

    public static function aboutImageUrl(): string
    {
        return asset(self::ABOUT_IMAGE);
    }

    public static function sections(): array
    {
        return [
            'highlights' => true,
            'services' => true,
            'process' => true,
            'about' => true,
            'warranty' => true,
            'testimonials' => true,
            'hours' => true,
            'posts' => true,
            'cta' => true,
            'contact' => true,
        ];
    }

    public static function copy(): array
    {
        return [
            'highlights' => [
                'kicker' => 'Keunggulan',
                'title' => 'Mengapa memilih bengkel kami',
                'lead' => 'Standar kerja yang jelas untuk hasil dingin yang konsisten dan pengalaman servis yang tenang.',
            ],
            'services' => [
                'kicker' => 'Layanan',
                'title' => 'Keahlian yang kami andalkan',
                'lead' => 'Fokus pada hasil dingin yang stabil, pengerjaan rapi, dan komunikasi yang jelas sejak awal.',
            ],
            'process' => [
                'kicker' => 'Alur servis',
                'title' => 'Proses yang transparan dari awal hingga selesai',
                'lead' => 'Setiap tahap dapat Anda pantau, termasuk melalui portal pelanggan.',
            ],
            'testimonials' => [
                'kicker' => 'Testimoni',
                'title' => 'Dipercaya pemilik kendaraan',
                'lead' => 'Cerita singkat dari pelanggan yang sudah merasakan hasil servis kami.',
            ],
            'hours' => [
                'kicker' => 'Jam operasional',
                'title' => 'Kapan kami siap melayani',
                'lead' => 'Datang langsung atau booking terlebih dahulu agar antrean lebih nyaman.',
            ],
            'posts' => [
                'kicker' => 'Berita & Promo',
                'title' => 'Update dan penawaran terbaru',
                'lead' => 'Ikuti kabar layanan, promo, dan informasi resmi dari bengkel.',
            ],
        ];
    }

    public static function highlights(): array
    {
        return [
            ['title' => 'Teknisi berpengalaman', 'description' => 'Penanganan AC mobil dengan diagnosa yang teliti sebelum perbaikan.', 'icon' => 'wrench'],
            ['title' => 'Garansi servis', 'description' => 'Pekerjaan dilindungi garansi sesuai ketentuan bengkel dan bukti SPK.', 'icon' => 'shield'],
            ['title' => 'Portal pelacakan', 'description' => 'Pantau status perbaikan kendaraan secara online kapan saja.', 'icon' => 'clock'],
            ['title' => 'Spare part terkurasi', 'description' => 'Suku cadang yang cocok dan stok yang siap untuk pengerjaan lebih cepat.', 'icon' => 'package'],
        ];
    }

    public static function process(): array
    {
        return [
            ['title' => 'Booking / datang', 'description' => 'Jadwalkan servis atau datang langsung ke bengkel.'],
            ['title' => 'Diagnosa', 'description' => 'Teknisi memeriksa sistem AC dan menjelaskan temuan secara jelas.'],
            ['title' => 'Perbaikan', 'description' => 'Pengerjaan dilakukan sesuai estimasi, dengan update progres bila perlu.'],
            ['title' => 'Serah terima', 'description' => 'Uji hasil pendinginan, penjelasan garansi, dan kendaraan siap dibawa.'],
        ];
    }

    public static function testimonials(): array
    {
        return [
            ['name' => 'Andi Pratama', 'vehicle' => 'Toyota Avanza', 'quote' => 'AC kembali dingin merata. Komunikasi jelas dan pengerjaan rapi.'],
            ['name' => 'Siti Rahma', 'vehicle' => 'Honda Jazz', 'quote' => 'Bisa pantau status lewat portal, jadi tidak perlu bolak-balik bertanya.'],
            ['name' => 'Budi Santoso', 'vehicle' => 'Mitsubishi Xpander', 'quote' => 'Isi freon dan cuci evaporator hasilnya terasa langsung. Direkomendasikan.'],
        ];
    }

    public static function hours(): array
    {
        return [
            ['day' => 'Senin – Jumat', 'time' => '08.00 – 17.00'],
            ['day' => 'Sabtu', 'time' => '08.00 – 15.00'],
            ['day' => 'Minggu', 'time' => 'Tutup'],
        ];
    }

    public static function services(): array
    {
        return [
            ['title' => 'Servis AC Mobil', 'description' => 'Cuci evaporator, isi freon, cek kebocoran, dan perbaikan kompresor.', 'icon' => 'car'],
            ['title' => 'Booking & Lacak Servis', 'description' => 'Jadwalkan servis dan pantau progres perbaikan kendaraan secara online lewat portal pelanggan.', 'icon' => 'clock'],
            ['title' => 'Penjualan Spare Part', 'description' => 'Suku cadang AC original & kompatibel dengan stok terkini.', 'icon' => 'package'],
        ];
    }
}
