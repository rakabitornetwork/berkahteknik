<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'po_number',
        'supplier_id',
        'order_date',
        'total_amount',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();
        // Generate PO number when creating if not provided
        static::creating(function ($po) {
            if (empty($po->po_number)) {
                $date = now()->format('Ymd');
                $count = static::whereDate('created_at', now()->toDateString())->count() + 1;
                $po->po_number = 'PO-' . $date . '-' . Str::padLeft($count, 5, '0');
            }
        });
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }
}
?>
