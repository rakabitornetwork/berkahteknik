<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            $table->string('landing_hero_title')->nullable();
            $table->string('landing_hero_subtitle')->nullable();
            $table->string('landing_hero_image_path')->nullable();
            $table->string('landing_hero_cta_label')->default('Lacak Servis Kendaraan');
            $table->string('landing_hero_cta_url')->default('/portal/login');
            $table->string('landing_about_title')->nullable();
            $table->text('landing_about_body')->nullable();
            $table->string('landing_about_image_path')->nullable();
            $table->json('landing_services_json')->nullable();
            $table->boolean('landing_show_latest_posts')->default(true);
            $table->unsignedTinyInteger('landing_posts_limit')->default(6);
        });
    }

    public function down(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            $table->dropColumn([
                'landing_hero_title',
                'landing_hero_subtitle',
                'landing_hero_image_path',
                'landing_hero_cta_label',
                'landing_hero_cta_url',
                'landing_about_title',
                'landing_about_body',
                'landing_about_image_path',
                'landing_services_json',
                'landing_show_latest_posts',
                'landing_posts_limit',
            ]);
        });
    }
};
