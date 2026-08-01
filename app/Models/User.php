<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'username',
        'photo',
        'role',
        'position_id',
        'base_salary',
        'transport_allowance',
        'tenure_allowance',
        'thr',
        'ktp_photo_path',
        'attendance_qr_token',
    ];

    protected $appends = [
        'total_salary',
        'ktp_photo_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'base_salary' => 'float',
            'transport_allowance' => 'float',
            'tenure_allowance' => 'float',
            'thr' => 'float',
        ];
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function salaries()
    {
        return $this->hasMany(EmployeeSalary::class, 'user_id');
    }

    public function getTotalSalaryAttribute(): float
    {
        return (float) $this->base_salary
            + (float) $this->transport_allowance
            + (float) $this->tenure_allowance
            + (float) $this->thr;
    }

    public function getKtpPhotoUrlAttribute(): ?string
    {
        return $this->ktp_photo_path ? '/storage/'.$this->ktp_photo_path : null;
    }
}

