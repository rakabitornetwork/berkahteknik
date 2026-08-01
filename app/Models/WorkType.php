<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkType extends Model
{
    protected $fillable = [
        'name',
        'service_category_id',
        'unit',
        'default_fee',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'default_fee' => 'float',
    ];

    public function category()
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function workItems()
    {
        return $this->hasMany(ServiceWorkItem::class);
    }
}
