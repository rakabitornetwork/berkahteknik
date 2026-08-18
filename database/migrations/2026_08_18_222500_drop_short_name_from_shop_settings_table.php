<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('shop_settings', 'short_name')) {
            Schema::table('shop_settings', function (Blueprint $table) {
                $table->dropColumn('short_name');
            });
        }

        Cache::forget('shop_settings');
    }

    public function down(): void
    {
        if (! Schema::hasColumn('shop_settings', 'short_name')) {
            Schema::table('shop_settings', function (Blueprint $table) {
                $table->string('short_name')->default('AC Berkah')->after('legal_name');
            });
        }
    }
};
