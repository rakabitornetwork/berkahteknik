<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->decimal('subtotal', 12, 2)->default(0)->after('customer_name');
            $table->decimal('discount_percent', 5, 2)->default(0)->after('subtotal');
            $table->decimal('discount_amount', 12, 2)->default(0)->after('discount_percent');
            $table->decimal('discount_total', 12, 2)->default(0)->after('discount_amount');
            $table->boolean('tax_enabled')->default(false)->after('discount_total');
            $table->decimal('tax_percent', 5, 2)->default(11)->after('tax_enabled');
            $table->decimal('tax_amount', 12, 2)->default(0)->after('tax_percent');
        });

        Schema::table('sale_items', function (Blueprint $table) {
            $table->decimal('discount_percent', 5, 2)->default(0)->after('unit_price');
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn([
                'subtotal',
                'discount_percent',
                'discount_amount',
                'discount_total',
                'tax_enabled',
                'tax_percent',
                'tax_amount',
            ]);
        });

        Schema::table('sale_items', function (Blueprint $table) {
            $table->dropColumn('discount_percent');
        });
    }
};
