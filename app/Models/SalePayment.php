<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalePayment extends Model
{
    protected $fillable = [
        'sale_id',
        'method',
        'amount',
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
