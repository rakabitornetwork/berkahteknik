<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'receipt_number',
        'customer_name',
        'total_amount',
        'amount_paid',
        'change_amount',
        'payment_status',
        'payment_method',
    ];

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }
}
