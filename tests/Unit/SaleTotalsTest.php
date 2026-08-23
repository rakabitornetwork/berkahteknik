<?php

namespace Tests\Unit;

use App\Services\SaleTotals;
use PHPUnit\Framework\TestCase;

class SaleTotalsTest extends TestCase
{
    public function test_line_discount_and_invoice_tax(): void
    {
        $lines = [
            ['unit_price' => 100000, 'quantity' => 2, 'discount_percent' => 10],
            ['unit_price' => 50000, 'quantity' => 1, 'discount_percent' => 0],
        ];

        $totals = SaleTotals::invoice($lines, 10, 5000, true, 11);

        $this->assertSame(230000.0, $totals['subtotal']);
        $this->assertSame(28000.0, $totals['discount_total']);
        $this->assertSame(22220.0, $totals['tax_amount']);
        $this->assertSame(224220.0, $totals['total_amount']);
    }

    public function test_tax_stays_off_when_disabled(): void
    {
        $totals = SaleTotals::invoice([
            ['unit_price' => 100000, 'quantity' => 1, 'discount_percent' => 0],
        ], 0, 0, false, 11);

        $this->assertSame(100000.0, $totals['subtotal']);
        $this->assertSame(0.0, $totals['tax_amount']);
        $this->assertSame(100000.0, $totals['total_amount']);
    }
}
