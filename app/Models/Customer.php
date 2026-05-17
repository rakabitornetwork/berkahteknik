<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Customer extends Authenticatable
{
    use Notifiable;

    protected $fillable = ['name', 'phone', 'address', 'password', 'remember_token'];

    protected $hidden = ['password', 'remember_token'];

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }
}
