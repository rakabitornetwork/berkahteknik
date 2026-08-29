<?php

namespace App\Models;

use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'receipt_number',
        'customer_name',
        'subtotal',
        'discount_percent',
        'discount_amount',
        'discount_total',
        'tax_enabled',
        'tax_percent',
        'tax_amount',
        'total_amount',
        'amount_paid',
        'change_amount',
        'payment_status',
        'payment_method',
        'branch_id',
    ];

    protected $casts = [
        'subtotal' => 'float',
        'discount_percent' => 'float',
        'discount_amount' => 'float',
        'discount_total' => 'float',
        'tax_enabled' => 'boolean',
        'tax_percent' => 'float',
        'tax_amount' => 'float',
        'total_amount' => 'float',
        'amount_paid' => 'float',
        'change_amount' => 'float',
    ];

    protected static function booted(): void
    {
        static::creating(function (Sale $sale) {
            if (empty($sale->receipt_number)) {
                $sale->receipt_number = static::nextReceiptNumber();
            }
        });
    }

    public static function formatReceiptNumber(?string $number, DateTimeInterface|string|null $when = null): string
    {
        $date = Carbon::parse($when ?? now())->format('Y/m/d');
        $raw = trim((string) $number);

        if ($raw !== '' && preg_match('/^INV-.+-\d{4}\/\d{2}\/\d{2}$/', $raw)) {
            return $raw;
        }

        $code = $raw;
        if (str_starts_with($raw, 'TRX-')) {
            $code = substr($raw, 4);
        } elseif (str_starts_with($raw, 'INV-')) {
            $code = preg_replace('/-\d{4}\/\d{2}\/\d{2}$/', '', substr($raw, 4)) ?: substr($raw, 4);
        }

        return 'INV-'.($code !== '' ? $code : '00001').'-'.$date;
    }

    protected function receiptNumber(): Attribute
    {
        return Attribute::make(
            get: function (?string $value) {
                return static::formatReceiptNumber($value, $this->attributes['created_at'] ?? now());
            },
            set: fn (?string $value) => $value,
        );
    }

    public static function nextReceiptNumber(DateTimeInterface|string|null $when = null): string
    {
        $last = static::query()
            ->where('receipt_number', 'like', 'INV-%')
            ->lockForUpdate()
            ->orderByDesc('id')
            ->value('receipt_number');

        $seq = 1;
        if (is_string($last) && preg_match('/^INV-(\d+)-/', $last, $matches)) {
            $seq = (int) $matches[1] + 1;
        }

        return static::formatReceiptNumber(
            'INV-'.str_pad((string) $seq, 5, '0', STR_PAD_LEFT),
            $when ?? now()
        );
    }

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }
}
