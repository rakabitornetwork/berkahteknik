<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SparePart extends Model
{
    protected $fillable = ['code', 'name', 'unit', 'stock', 'min_stock', 'buy_price', 'sell_price', 'description'];

    public function services()
    {
        return $this->belongsToMany(Service::class, 'service_spare_parts')
                    ->withPivot('quantity', 'unit_price')
                    ->withTimestamps();
    }

    public function isLowStock(): bool
    {
        return $this->stock <= $this->min_stock;
    }
}
