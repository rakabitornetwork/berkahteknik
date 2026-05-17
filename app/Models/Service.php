<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'vehicle_id', 'user_id', 'status', 'description',
        'diagnosis', 'service_fee', 'payment_status', 'started_at', 'completed_at', 'is_bring_own_part', 'service_name'
    ];

    protected $casts = [
        'started_at'   => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function technician()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function spareParts()
    {
        return $this->belongsToMany(SparePart::class, 'service_spare_parts')
                    ->withPivot('quantity', 'unit_price')
                    ->withTimestamps();
    }

    public function getTotalCostAttribute()
    {
        $partsTotal = $this->spareParts->sum(fn ($p) => $p->pivot->quantity * $p->pivot->unit_price);
        return $partsTotal + (float) $this->service_fee;
    }
}
