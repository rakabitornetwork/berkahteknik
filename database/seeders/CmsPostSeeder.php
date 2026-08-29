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
                'landing_hero_subtitle' => 'Perawatan, perbaikan, dan isi freon AC mobil dengan teknisi berpengalaman.',
                'landing_hero_cta_label' => 'Lacak Servis Kendaraan',
                'landing_hero_cta_url' => '/portal/login',
                'landing_about_title' => 'Tentang Bengkel Kami',
                'landing_about_body' => "Bengkel AC mobil kami hadir dengan standar kerja rapi, transparan, dan bergaransi.\n\nPelanggan dapat memantau progres servis kendaraan secara online melalui portal pelanggan.",
                'landing_services_json' => \App\Support\LandingDefaults::services(),
                'landing_show_latest_posts' => true,
                'landing_posts_limit' => 6,
            ]);
        }

        foreach (require database_path('data/cms_bundled_posts.php') as $post) {
            CmsPost::query()->firstOrCreate(
                ['slug' => $post['slug']],
                $post
            );
        }
    }
}
