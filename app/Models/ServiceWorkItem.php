<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceWorkItem extends Model
{
    protected $fillable = ['service_id', 'work_type_id', 'name', 'quantity', 'unit'];

    protected $casts = [
        'quantity' => 'integer',
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
