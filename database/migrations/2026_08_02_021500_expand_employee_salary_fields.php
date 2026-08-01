<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('transport_allowance', 12, 2)->default(0)->after('base_salary');
            $table->decimal('tenure_allowance', 12, 2)->default(0)->after('transport_allowance');
            $table->decimal('thr', 12, 2)->default(0)->after('tenure_allowance');
            $table->string('ktp_photo_path')->nullable()->after('thr');
        });

        Schema::table('employee_salaries', function (Blueprint $table) {
            $table->renameColumn('base_salary', 'pendapatan');
            $table->renameColumn('allowance', 'tunjangan_transport');
            $table->renameColumn('deduction', 'potongan');
        });

        Schema::table('employee_salaries', function (Blueprint $table) {
            $table->dropColumn('bonus');
            $table->decimal('intensif_jasa', 12, 2)->default(0)->after('tunjangan_transport');
            $table->decimal('intensif_sparepart', 12, 2)->default(0)->after('intensif_jasa');
        });
    }

    public function down(): void
    {
        Schema::table('employee_salaries', function (Blueprint $table) {
            $table->dropColumn(['intensif_jasa', 'intensif_sparepart']);
            $table->decimal('bonus', 12, 2)->default(0)->after('tunjangan_transport');
        });

        Schema::table('employee_salaries', function (Blueprint $table) {
            $table->renameColumn('pendapatan', 'base_salary');
            $table->renameColumn('tunjangan_transport', 'allowance');
            $table->renameColumn('potongan', 'deduction');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['transport_allowance', 'tenure_allowance', 'thr', 'ktp_photo_path']);
        });
    }
};
