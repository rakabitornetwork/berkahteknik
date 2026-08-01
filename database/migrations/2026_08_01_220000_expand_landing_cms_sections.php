<?php

use App\Support\LandingDefaults;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            $table->json('landing_sections_json')->nullable()->after('landing_posts_limit');
            $table->json('landing_copy_json')->nullable()->after('landing_sections_json');
            $table->json('landing_highlights_json')->nullable()->after('landing_copy_json');
            $table->json('landing_process_json')->nullable()->after('landing_highlights_json');
            $table->json('landing_testimonials_json')->nullable()->after('landing_process_json');
            $table->json('landing_hours_json')->nullable()->after('landing_testimonials_json');
            $table->string('landing_warranty_title')->nullable()->after('landing_hours_json');
            $table->text('landing_warranty_body')->nullable()->after('landing_warranty_title');
            $table->string('landing_cta_title')->nullable()->after('landing_warranty_body');
            $table->string('landing_cta_body')->nullable()->after('landing_cta_title');
            $table->string('landing_cta_label')->nullable()->after('landing_cta_body');
            $table->string('landing_cta_url')->nullable()->after('landing_cta_label');
            $table->string('landing_contact_title')->nullable()->after('landing_cta_url');
            $table->string('landing_contact_lead')->nullable()->after('landing_contact_title');
        });

        foreach (DB::table('shop_settings')->get() as $row) {
            DB::table('shop_settings')->where('id', $row->id)->update([
                'landing_sections_json' => json_encode(LandingDefaults::sections()),
                'landing_copy_json' => json_encode(LandingDefaults::copy()),
                'landing_highlights_json' => json_encode(LandingDefaults::highlights()),
                'landing_process_json' => json_encode(LandingDefaults::process()),
                'landing_testimonials_json' => json_encode(LandingDefaults::testimonials()),
                'landing_hours_json' => json_encode(LandingDefaults::hours()),
                'landing_warranty_title' => 'Garansi pekerjaan yang jelas',
                'landing_warranty_body' => $row->warranty_policy ?: 'Garansi servis berlaku sesuai ketentuan bengkel. Klaim garansi wajib disertai bukti servis/SPK.',
                'landing_cta_title' => 'Pantau progres servis secara langsung',
                'landing_cta_body' => 'Masuk ke portal untuk melihat status perbaikan, riwayat kendaraan, dan pembaruan dari bengkel.',
                'landing_cta_label' => $row->landing_hero_cta_label ?: 'Lacak Servis Kendaraan',
                'landing_cta_url' => $row->landing_hero_cta_url ?: '/portal/login',
                'landing_contact_title' => 'Hubungi kami',
                'landing_contact_lead' => 'Siap membantu konsultasi, booking, dan pertanyaan seputar servis AC mobil.',
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            $table->dropColumn([
                'landing_sections_json',
                'landing_copy_json',
                'landing_highlights_json',
                'landing_process_json',
                'landing_testimonials_json',
                'landing_hours_json',
                'landing_warranty_title',
                'landing_warranty_body',
                'landing_cta_title',
                'landing_cta_body',
                'landing_cta_label',
                'landing_cta_url',
                'landing_contact_title',
                'landing_contact_lead',
            ]);
        });
    }
};
