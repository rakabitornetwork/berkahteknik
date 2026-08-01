<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->string('customer_type', 20)->default('servis')->after('address');
            // servis = pelanggan bengkel/servis kendaraan
            // sparepart = pembeli sparepart retail
            // bengkel = bengkel sekitar pembeli sparepart
        });

        Schema::table('work_types', function (Blueprint $table) {
            $table->foreignId('service_category_id')->nullable()->after('id')->constrained('service_categories')->nullOnDelete();
            $table->decimal('default_fee', 12, 2)->default(0)->after('unit');
        });
    }

    public function down(): void
    {
        Schema::table('work_types', function (Blueprint $table) {
            $table->dropConstrainedForeignId('service_category_id');
            $table->dropColumn('default_fee');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('customer_type');
        });
    }
};
