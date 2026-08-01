<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Customer extends Authenticatable
{
    use Notifiable;

    protected $fillable = ['name', 'phone', 'address', 'customer_type', 'password', 'remember_token'];

    protected $hidden = ['password', 'remember_token'];

    public const TYPE_SERVIS = 'servis';
    public const TYPE_SPAREPART = 'sparepart';
    public const TYPE_BENGKEL = 'bengkel';

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function scopeServis($query)
    {
        return $query->where(function ($q) {
            $q->where('customer_type', self::TYPE_SERVIS)
                ->orWhereNull('customer_type');
        });
    }

    public function scopeSparepartBuyers($query)
    {
        return $query->whereIn('customer_type', [self::TYPE_SPAREPART, self::TYPE_BENGKEL]);
    }
}
