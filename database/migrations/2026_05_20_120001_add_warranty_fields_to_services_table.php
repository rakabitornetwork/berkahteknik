<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->unsignedTinyInteger('warranty_months')->nullable()->after('spk_issued_at');
            $table->text('warranty_notes')->nullable()->after('warranty_months');
            $table->text('warranty_terms')->nullable()->after('warranty_notes');
            $table->date('warranty_starts_at')->nullable()->after('warranty_terms');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'warranty_months',
                'warranty_notes',
                'warranty_terms',
                'warranty_starts_at',
            ]);
        });
    }
};
