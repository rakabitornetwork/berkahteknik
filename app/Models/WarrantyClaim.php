<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WarrantyClaim extends Model
{
    protected $fillable = [
        'service_id', 'customer_id', 'user_id', 'assigned_user_id',
        'status', 'complaint', 'resolution', 'claimed_at', 'resolved_at',
    ];

    protected $casts = [
        'claimed_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];
}
