<?php

namespace App\Services;

use App\Models\SparePart;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OperationalJournal
{
    public function stock(
        SparePart $part,
        string $type,
        int $quantity,
        int $stockBefore,
        int $stockAfter,
        ?Model $source = null,
        ?string $notes = null,
        ?float $unitCost = null
    ): void {
        DB::table('stock_movements')->insert([
            'spare_part_id' => $part->id,
            'warehouse_id' => $part->warehouse_id ?? null,
            'user_id' => Auth::id(),
            'source_type' => $source ? $source::class : null,
            'source_id' => $source?->getKey(),
            'type' => $type,
            'quantity' => $quantity,
            'stock_before' => $stockBefore,
            'stock_after' => $stockAfter,
            'unit_cost' => $unitCost,
            'notes' => $notes,
            'occurred_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function cash(
        string $type,
        string $category,
        float $amount,
        ?Model $source = null,
        ?string $description = null,
        mixed $occurredAt = null
    ): void {
        DB::table('cash_ledger_entries')->insert([
            'branch_id' => $source?->branch_id ?? Auth::user()?->branch_id,
            'user_id' => Auth::id(),
            'source_type' => $source ? $source::class : null,
            'source_id' => $source?->getKey(),
            'type' => $type,
            'category' => $category,
            'description' => $description,
            'amount' => $amount,
            'occurred_at' => $occurredAt ? \Carbon\Carbon::parse($occurredAt) : now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function audit(string $action, string $module, ?Model $subject = null, ?string $description = null, array $properties = []): void
    {
        $request = request();

        DB::table('audit_logs')->insert([
            'user_id' => Auth::id(),
            'action' => $action,
            'module' => $module,
            'subject_type' => $subject ? $subject::class : null,
            'subject_id' => $subject?->getKey(),
            'description' => $description,
            'properties' => $properties ? json_encode($properties) : null,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
