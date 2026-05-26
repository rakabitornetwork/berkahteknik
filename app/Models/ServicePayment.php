<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicePayment extends Model
{
    protected $fillable = ['service_id', 'user_id', 'payment_date', 'amount', 'payment_method', 'notes'];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'float',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
