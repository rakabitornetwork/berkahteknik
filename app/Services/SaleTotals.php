<?php

namespace App\Services;

class SaleTotals
{
    public static function lineTotal(float $unitPrice, int $quantity, float $discountPercent = 0): float
    {
        $gross = $unitPrice * $quantity;
        $percent = self::clampPercent($discountPercent);

        return self::round($gross * (1 - ($percent / 100)));
    }

    /**
     * @param  array<int, array{unit_price: float|int|string, quantity: int, discount_percent?: float|int|string}>  $lines
     * @return array{subtotal: float, discount_total: float, tax_amount: float, total_amount: float}
     */
    public static function invoice(
        array $lines,
        float $discountPercent = 0,
        float $discountAmount = 0,
        bool $taxEnabled = false,
        float $taxPercent = 0
    ): array {
        $subtotal = 0.0;

        foreach ($lines as $line) {
            $subtotal += self::lineTotal(
                (float) $line['unit_price'],
                (int) $line['quantity'],
                (float) ($line['discount_percent'] ?? 0)
            );
        }

        $subtotal = self::round($subtotal);
        $percentDiscount = self::round($subtotal * (self::clampPercent($discountPercent) / 100));
        $discountTotal = min($subtotal, self::round($percentDiscount + max(0, $discountAmount)));
        $taxable = max(0.0, self::round($subtotal - $discountTotal));
        $taxAmount = $taxEnabled ? self::round($taxable * (self::clampPercent($taxPercent) / 100)) : 0.0;

        return [
            'subtotal' => $subtotal,
            'discount_total' => $discountTotal,
            'tax_amount' => $taxAmount,
            'total_amount' => self::round($taxable + $taxAmount),
        ];
    }

    private static function clampPercent(float $percent): float
    {
        return min(100, max(0, $percent));
    }

    private static function round(float $amount): float
    {
        return round($amount, 2);
    }
}
