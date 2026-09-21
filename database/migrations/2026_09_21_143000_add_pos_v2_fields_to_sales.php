<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->foreignId('customer_id')->nullable()->after('customer_name')->constrained()->nullOnDelete();
            $table->timestamp('sold_at')->nullable()->after('branch_id');
            $table->text('notes')->nullable()->after('sold_at');
            $table->foreignId('cashier_id')->nullable()->after('notes')->constrained('users')->nullOnDelete();
            $table->unsignedTinyInteger('pos_version')->default(1)->after('cashier_id');
            $table->string('cancel_reason')->nullable()->after('pos_version');
        });

        if (Schema::hasTable('warehouses')) {
            Schema::table('sales', function (Blueprint $table) {
                $table->foreignId('warehouse_id')->nullable()->after('cashier_id')->constrained('warehouses')->nullOnDelete();
            });
        } else {
            Schema::table('sales', function (Blueprint $table) {
                $table->unsignedBigInteger('warehouse_id')->nullable()->after('cashier_id');
            });
        }

        Schema::create('sale_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->cascadeOnDelete();
            $table->string('method', 32);
            $table->decimal('amount', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_payments');

        Schema::table('sales', function (Blueprint $table) {
            $table->dropConstrainedForeignId('customer_id');
            $table->dropConstrainedForeignId('cashier_id');
            if (Schema::hasColumn('sales', 'warehouse_id') && Schema::hasTable('warehouses')) {
                $table->dropConstrainedForeignId('warehouse_id');
            } elseif (Schema::hasColumn('sales', 'warehouse_id')) {
                $table->dropColumn('warehouse_id');
            }
            $table->dropColumn(['sold_at', 'notes', 'pos_version', 'cancel_reason']);
        });
    }
};
