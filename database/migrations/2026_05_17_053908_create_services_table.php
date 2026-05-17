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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // Technician
            $table->string('status')->default('antri'); // antri, dikerjakan, selesai
            $table->text('description');                // Keluhan pelanggan
            $table->text('diagnosis')->nullable();       // Diagnosa teknisi
            $table->decimal('service_fee', 12, 2)->default(0); // Biaya jasa
            $table->string('payment_status')->default('belum_lunas'); // belum_lunas, lunas
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
