<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_number')->unique();
            $table->string('customer_name')->nullable();
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('payment_status')->default('lunas'); // lunas, belum_lunas
            $table->string('payment_method')->nullable(); // cash, transfer
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
