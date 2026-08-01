<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('unit', 20)->default('JOB');
            $table->decimal('default_fee', 12, 2)->default(0);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('product_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('work_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('unit', 20)->default('JOB');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::table('spare_parts', function (Blueprint $table) {
            $table->foreignId('product_type_id')->nullable()->after('name')->constrained('product_types')->nullOnDelete();
        });

        Schema::table('services', function (Blueprint $table) {
            $table->foreignId('service_category_id')->nullable()->after('service_name')->constrained('service_categories')->nullOnDelete();
        });

        Schema::table('service_work_items', function (Blueprint $table) {
            $table->foreignId('work_type_id')->nullable()->after('service_id')->constrained('work_types')->nullOnDelete();
            $table->string('unit', 20)->default('JOB')->after('quantity');
        });
    }

    public function down(): void
    {
        Schema::table('service_work_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('work_type_id');
            $table->dropColumn('unit');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropConstrainedForeignId('service_category_id');
        });

        Schema::table('spare_parts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('product_type_id');
        });

        Schema::dropIfExists('work_types');
        Schema::dropIfExists('product_types');
        Schema::dropIfExists('service_categories');
    }
};
