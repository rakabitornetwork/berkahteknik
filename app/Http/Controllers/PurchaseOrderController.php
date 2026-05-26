<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
use App\Models\SparePart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of purchase orders.
     */
    public function index()
    {
        $orders = PurchaseOrder::with('supplier')
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        return Inertia::render('Admin/PurchaseOrders/Index', ['orders' => $orders]);
    }

    /**
     * Show the form for creating a new purchase order.
     */
    public function create()
    {
        $suppliers = Supplier::orderBy('name')->get(['id', 'name']);
        $spareParts = \App\Models\SparePart::orderBy('name')->get(['id', 'name', 'stock', 'buy_price']);
        return Inertia::render('Admin/PurchaseOrders/Form', [
            'suppliers' => $suppliers,
            'spareParts' => $spareParts,
        ]);
    }

    /**
     * Store a newly created purchase order.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date'  => 'required|date',
            'items'       => 'required|array|min:1',
            'items.*.spare_part_id' => 'required|exists:spare_parts,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $order = PurchaseOrder::create([
            'supplier_id' => $validated['supplier_id'],
            'order_date'  => $validated['order_date'],
            'status'      => 'pending',
        ]);

        $total = 0;
        foreach ($validated['items'] as $item) {
            PurchaseOrderItem::create([
                'purchase_order_id' => $order->id,
                'spare_part_id'    => $item['spare_part_id'],
                'quantity'         => $item['quantity'],
                'unit_price'       => $item['unit_price'],
            ]);
            $total += $item['quantity'] * $item['unit_price'];
        }
        $order->total_amount = $total;
        $order->save();

        return redirect()->route('admin.purchase-orders.index')->with('success', 'Purchase Order created successfully.');
    }

    /**
     * Display the specified purchase order.
     */
    public function show(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load('supplier', 'items.sparePart');
        return Inertia::render('Admin/PurchaseOrders/Show', ['order' => $purchaseOrder]);
    }

    /**
     * Show the form for editing the specified purchase order.
     */
    public function edit(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->load('items');
        $suppliers = Supplier::orderBy('name')->get(['id', 'name']);
        $spareParts = \App\Models\SparePart::orderBy('name')->get(['id', 'name', 'stock', 'buy_price']);
        return Inertia::render('Admin/PurchaseOrders/Form', [
            'order' => $purchaseOrder,
            'suppliers' => $suppliers,
            'spareParts' => $spareParts,
        ]);
    }

    /**
     * Update the specified purchase order.
     */
    public function update(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date'  => 'required|date',
            'status'      => 'required|in:pending,completed,cancelled',
            'items'       => 'required|array|min:1',
            'items.*.id' => 'sometimes|exists:purchase_order_items,id',
            'items.*.spare_part_id' => 'required|exists:spare_parts,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $purchaseOrder->update([
            'supplier_id' => $validated['supplier_id'],
            'order_date'  => $validated['order_date'],
            'status'      => $validated['status'],
        ]);

        // Sync items (simple approach: delete existing and recreate)
        $purchaseOrder->items()->delete();
        $total = 0;
        foreach ($validated['items'] as $item) {
            PurchaseOrderItem::create([
                'purchase_order_id' => $purchaseOrder->id,
                'spare_part_id'    => $item['spare_part_id'],
                'quantity'         => $item['quantity'],
                'unit_price'       => $item['unit_price'],
            ]);
            $total += $item['quantity'] * $item['unit_price'];
        }
        $purchaseOrder->total_amount = $total;
        $purchaseOrder->save();

        return redirect()->route('admin.purchase-orders.index')->with('success', 'Purchase Order updated successfully.');
    }

    /**
     * Remove the specified purchase order.
     */
    public function destroy(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->delete();
        return redirect()->route('admin.purchase-orders.index')->with('success', 'Purchase Order deleted successfully.');
    }

    /**
     * Update status of purchase order (e.g., mark as completed).
     */
    public function updateStatus(Request $request, PurchaseOrder $purchaseOrder)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,completed,cancelled',
        ]);

        $purchaseOrder->status = $validated['status'];
        $purchaseOrder->save();

        if ($validated['status'] === 'completed') {
            // Auto‑add stock and update buy_price
            foreach ($purchaseOrder->items as $item) {
                $spare = SparePart::find($item->spare_part_id);
                if ($spare) {
                    $spare->stock += $item->quantity;
                    $spare->buy_price = $item->unit_price; // set latest purchase price
                    $spare->save();
                }
            }
        }

        return redirect()->route('admin.purchase-orders.show', $purchaseOrder)->with('success', 'Status updated successfully.');
    }
}
?>
