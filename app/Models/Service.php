<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'vehicle_id', 'user_id', 'status', 'description',
        'diagnosis', 'work_instructions', 'mechanic_notes',
        'service_fee', 'payment_status', 'started_at', 'completed_at',
        'is_bring_own_part', 'service_name', 'spk_number', 'spk_issued_at',
        'warranty_months', 'warranty_notes', 'warranty_terms', 'warranty_starts_at',
    ];

    protected $appends = [
        'effective_warranty_months',
        'warranty_expires_at',
        'has_active_warranty',
    ];

    protected $casts = [
        'started_at'    => 'datetime',
        'completed_at'  => 'datetime',
        'spk_issued_at' => 'datetime',
        'warranty_starts_at' => 'date',
    ];

    protected static function booted(): void
    {
        static::creating(function (Service $service) {
            if (empty($service->spk_number)) {
                $service->spk_number = static::nextSpkNumber();
            }
            if (empty($service->spk_issued_at)) {
                $service->spk_issued_at = now();
            }
        });
    }

    public static function nextSpkNumber(): string
    {
        $year = now()->format('Y');
        $prefix = "SPK-{$year}-";
        $last = static::where('spk_number', 'like', "{$prefix}%")
            ->orderByDesc('spk_number')
            ->value('spk_number');

        $seq = 1;
        if ($last) {
            $seq = (int) substr($last, strlen($prefix)) + 1;
        }

        return $prefix.str_pad((string) $seq, 5, '0', STR_PAD_LEFT);
    }

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

    public function getEffectiveWarrantyMonthsAttribute(): int
    {
        if ($this->warranty_months !== null) {
            return (int) $this->warranty_months;
        }

        return (int) ShopSetting::current()->warranty_default_months;
    }

    public function getWarrantyExpiresAtAttribute(): ?string
    {
        if ($this->status !== 'selesai') {
            return null;
        }

        $months = $this->effective_warranty_months;
        if ($months <= 0) {
            return null;
        }

        $start = $this->warranty_starts_at ?? $this->completed_at;
        if (! $start) {
            return null;
        }

        $startDate = $start instanceof Carbon ? $start : Carbon::parse($start);

        return $startDate->copy()->addMonths($months)->toDateString();
    }

    public function getHasActiveWarrantyAttribute(): bool
    {
        $expires = $this->warranty_expires_at;

        return $expires && Carbon::parse($expires)->endOfDay()->isFuture();
    }
}
