<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SparePart extends Model
{
    protected $fillable = ['code', 'barcode', 'name', 'product_type_id', 'unit', 'stock', 'min_stock', 'buy_price', 'sell_price', 'description', 'warehouse_id'];

    public function productType()
    {
        return $this->belongsTo(ProductType::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'service_spare_parts')
                    ->withPivot('quantity', 'unit_price')
                    ->withTimestamps();
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function isLowStock(): bool
    {
        return $this->stock <= $this->min_stock;
    }

    public static function nextQuickCode(): string
    {
        $prefix = 'POS-'.now()->format('ymd').'-';
        $last = static::where('code', 'like', $prefix.'%')
            ->orderByDesc('code')
            ->value('code');

        $seq = 1;
        if ($last) {
            $seq = (int) substr($last, strlen($prefix)) + 1;
        }

        return $prefix.str_pad((string) $seq, 3, '0', STR_PAD_LEFT);
    }
}
