<?php

use App\Models\Sale;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        foreach (DB::table('sales')->orderBy('id')->get() as $row) {
            $formatted = Sale::formatReceiptNumber($row->receipt_number, $row->created_at);
            if ($formatted === $row->receipt_number) {
                continue;
            }

            $exists = DB::table('sales')
                ->where('receipt_number', $formatted)
                ->where('id', '!=', $row->id)
                ->exists();

            if ($exists) {
                $formatted = Sale::formatReceiptNumber($row->receipt_number.'-'.$row->id, $row->created_at);
            }

            DB::table('sales')->where('id', $row->id)->update([
                'receipt_number' => $formatted,
            ]);
        }
    }

    public function down(): void
    {
        foreach (DB::table('sales')->orderBy('id')->get() as $row) {
            if (! preg_match('/^INV-(.+)-(\d{4}\/\d{2}\/\d{2})$/', (string) $row->receipt_number, $matches)) {
                continue;
            }

            $code = $matches[1];
            if (preg_match('/^\d{5}$/', $code)) {
                continue;
            }

            DB::table('sales')->where('id', $row->id)->update([
                'receipt_number' => 'TRX-'.$code,
            ]);
        }
    }
};
