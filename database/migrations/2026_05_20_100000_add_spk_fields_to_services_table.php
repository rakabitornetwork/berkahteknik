<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('spk_number')->nullable()->unique()->after('id');
            $table->text('work_instructions')->nullable()->after('diagnosis');
            $table->text('mechanic_notes')->nullable()->after('work_instructions');
            $table->timestamp('spk_issued_at')->nullable()->after('mechanic_notes');
        });

        $year = now()->format('Y');
        $prefix = "SPK-{$year}-";
        $seq = 1;

        foreach (DB::table('services')->orderBy('id')->get() as $service) {
            DB::table('services')->where('id', $service->id)->update([
                'spk_number'    => $prefix.str_pad((string) $seq++, 5, '0', STR_PAD_LEFT),
                'spk_issued_at' => $service->created_at ?? now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['spk_number', 'work_instructions', 'mechanic_notes', 'spk_issued_at']);
        });
    }
};
