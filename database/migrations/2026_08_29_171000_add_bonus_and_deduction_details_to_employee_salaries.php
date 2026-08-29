<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employee_salaries', function (Blueprint $table) {
            $table->decimal('bonus_reward', 12, 2)->default(0)->after('intensif_sparepart');
            $table->decimal('potongan_absensi', 12, 2)->default(0)->after('potongan');
            $table->decimal('potongan_piutang', 12, 2)->default(0)->after('potongan_absensi');
        });
    }

    public function down(): void
    {
        Schema::table('employee_salaries', function (Blueprint $table) {
            $table->dropColumn(['bonus_reward', 'potongan_absensi', 'potongan_piutang']);
        });
    }
};
