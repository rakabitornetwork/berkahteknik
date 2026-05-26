<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SparePart extends Model
{
    protected $fillable = ['code', 'barcode', 'name', 'unit', 'stock', 'min_stock', 'buy_price', 'sell_price', 'description', 'warehouse_id'];

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
}
