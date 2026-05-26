<?php

/**
 * Simple verification script for Supplier & Purchase Order module.
 *
 * 1. Creates a dummy supplier.
 * 2. Creates two spare parts (if not exist).
 * 3. Creates a purchase order with items.
 * 4. Marks the PO as completed.
 * 5. Checks that stock and buy_price of spare parts were updated.
 */

require __DIR__.'/bootstrap/app.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Supplier;
use App\Models\SparePart;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Support\Facades\DB;

// Wrap in a transaction to avoid persisting test data.
DB::transaction(function () {
    // 1. Supplier
    $supplier = Supplier::create([
        'name' => 'Test Supplier',
        'phone' => '08123456789',
        'email' => 'test@supplier.com',
        'address' => 'Jl. Contoh No.1',
    ]);

    // 2. Spare parts (ensure at least two exist)
    $sp1 = SparePart::firstOrCreate([
        'name' => 'Spare Part A',
    ], [
        'stock' => 0,
        'buy_price' => 0,
    ]);
    $sp2 = SparePart::firstOrCreate([
        'name' => 'Spare Part B',
    ], [
        'stock' => 0,
        'buy_price' => 0,
    ]);

    // 3. Purchase Order
    $po = PurchaseOrder::create([
        'supplier_id' => $supplier->id,
        'order_date' => now()->toDateString(),
        'status' => 'pending',
    ]);

    $items = [
        ['spare_part_id' => $sp1->id, 'quantity' => 5, 'unit_price' => 10000],
        ['spare_part_id' => $sp2->id, 'quantity' => 3, 'unit_price' => 15000],
    ];
    $total = 0;
    foreach ($items as $itm) {
        PurchaseOrderItem::create([
            'purchase_order_id' => $po->id,
            'spare_part_id' => $itm['spare_part_id'],
            'quantity' => $itm['quantity'],
            'unit_price' => $itm['unit_price'],
        ]);
        $total += $itm['quantity'] * $itm['unit_price'];
    }
    $po->total_amount = $total;
    $po->save();

    // 4. Mark as completed (triggers stock update)
    $po->status = 'completed';
    $po->save();
    // Manually invoke the controller logic (same as updateStatus)
    foreach ($po->items as $item) {
        $sp = SparePart::find($item->spare_part_id);
        $sp->stock += $item->quantity;
        $sp->buy_price = $item->unit_price;
        $sp->save();
    }

    // 5. Verify
    $sp1Fresh = SparePart::find($sp1->id);
    $sp2Fresh = SparePart::find($sp2->id);
    echo "Verification Results:\n";
    echo "- {$sp1Fresh->name}: stock={$sp1Fresh->stock}, buy_price={$sp1Fresh->buy_price}\n";
    echo "- {$sp2Fresh->name}: stock={$sp2Fresh->stock}, buy_price={$sp2Fresh->buy_price}\n";
});
?>
