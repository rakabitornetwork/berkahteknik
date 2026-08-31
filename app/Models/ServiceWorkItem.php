<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceWorkItem extends Model
{
    protected $fillable = ['service_id', 'work_type_id', 'name', 'quantity', 'unit', 'unit_price'];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'float',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function workType()
    {
        return $this->belongsTo(WorkType::class);
    }
}
