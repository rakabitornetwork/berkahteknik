<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceCategory extends Model
{
    protected $fillable = [
        'name',
        'unit',
        'default_fee',
        'description',
        'is_active',
    ];

    protected $casts = [
        'default_fee' => 'float',
        'is_active' => 'boolean',
    ];

    public function services()
    {
        return $this->hasMany(Service::class);
    }
}
