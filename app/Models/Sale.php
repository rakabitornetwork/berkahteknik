<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'receipt_number',
        'customer_name',
        'subtotal',
        'discount_percent',
        'discount_amount',
        'discount_total',
        'tax_enabled',
        'tax_percent',
        'tax_amount',
        'total_amount',
        'amount_paid',
        'change_amount',
        'payment_status',
        'payment_method',
        'branch_id',
    ];

    protected $casts = [
        'subtotal' => 'float',
        'discount_percent' => 'float',
        'discount_amount' => 'float',
        'discount_total' => 'float',
        'tax_enabled' => 'boolean',
        'tax_percent' => 'float',
        'tax_amount' => 'float',
        'total_amount' => 'float',
        'amount_paid' => 'float',
        'change_amount' => 'float',
    ];

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }
}
