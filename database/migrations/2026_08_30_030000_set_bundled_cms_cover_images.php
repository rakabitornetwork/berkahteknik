<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $covers = [
            'promo-servis-ac-mobil-diskon-15' => 'images/cms/cover-promo-servis-ac.jpg',
            'tips-merawat-ac-agar-awet' => 'images/cms/cover-tips-merawat-ac.jpg',
            'jam-operasional-bengkel' => 'images/cms/cover-jam-operasional.jpg',
            'ac-mobil-kurang-dingin-musim-kemarau' => 'images/cms/cover-diagnosa-ac-kurang-dingin.jpg',
        ];

        foreach ($covers as $slug => $path) {
            DB::table('cms_posts')->where('slug', $slug)->update([
                'cover_image_path' => $path,
            ]);
        }
    }

    public function down(): void
    {
        DB::table('cms_posts')
            ->whereIn('slug', [
                'promo-servis-ac-mobil-diskon-15',
                'tips-merawat-ac-agar-awet',
                'jam-operasional-bengkel',
                'ac-mobil-kurang-dingin-musim-kemarau',
            ])
            ->update(['cover_image_path' => null]);
    }
};
