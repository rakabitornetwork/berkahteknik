<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeSalary extends Model
{
    protected $fillable = [
        'user_id',
        'period_month',
        'period_year',
        'pendapatan',
        'potongan',
        'potongan_absensi',
        'potongan_piutang',
        'tunjangan_transport',
        'intensif_jasa',
        'intensif_sparepart',
        'bonus_reward',
        'net_salary',
        'status',
        'paid_at',
        'notes',
    ];

    protected $casts = [
        'pendapatan' => 'float',
        'potongan' => 'float',
        'potongan_absensi' => 'float',
        'potongan_piutang' => 'float',
        'tunjangan_transport' => 'float',
        'intensif_jasa' => 'float',
        'intensif_sparepart' => 'float',
        'bonus_reward' => 'float',
        'net_salary' => 'float',
        'paid_at' => 'date',
        'period_month' => 'integer',
        'period_year' => 'integer',
    ];

    public function employee()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public static function calculateNet(
        float $pendapatan,
        float $tunjanganTransport,
        float $intensifJasa,
        float $intensifSparepart,
        float $bonusReward,
        float $potongan,
        float $potonganAbsensi = 0,
        float $potonganPiutang = 0
    ): float {
        return max(
            0,
            $pendapatan
            + $tunjanganTransport
            + $intensifJasa
            + $intensifSparepart
            + $bonusReward
            - $potongan
            - $potonganAbsensi
            - $potonganPiutang
        );
    }
}
