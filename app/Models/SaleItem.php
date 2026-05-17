<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    protected $fillable = [
        'sale_id',
        'spare_part_id',
        'quantity',
        'unit_price',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function sparePart()
    {
        return $this->belongsTo(SparePart::class);
    }
}
