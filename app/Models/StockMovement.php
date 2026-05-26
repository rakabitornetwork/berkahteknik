<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'spare_part_id', 'warehouse_id', 'user_id', 'source_type', 'source_id',
        'type', 'quantity', 'stock_before', 'stock_after', 'unit_cost', 'notes', 'occurred_at',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
        'unit_cost' => 'float',
    ];
}
