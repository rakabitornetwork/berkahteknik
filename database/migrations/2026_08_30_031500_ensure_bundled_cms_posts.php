<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $posts = require database_path('data/cms_bundled_posts.php');
        $now = now();

        foreach ($posts as $post) {
            $exists = DB::table('cms_posts')->where('slug', $post['slug'])->exists();

            if ($exists) {
                DB::table('cms_posts')->where('slug', $post['slug'])->update([
                    'cover_image_path' => $post['cover_image_path'],
                    'updated_at' => $now,
                ]);

                continue;
            }

            DB::table('cms_posts')->insert([
                'title' => $post['title'],
                'slug' => $post['slug'],
                'type' => $post['type'],
                'excerpt' => $post['excerpt'],
                'body' => $post['body'],
                'cover_image_path' => $post['cover_image_path'],
                'is_published' => $post['is_published'],
                'published_at' => $post['published_at'],
                'sort_order' => $post['sort_order'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        DB::table('cms_posts')
            ->where('slug', 'ac-mobil-kurang-dingin-musim-kemarau')
            ->delete();
    }
};
