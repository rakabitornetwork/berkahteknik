import React from 'react';
import { lineTotal } from '../lib/saleTotals';

export default function SaleTotalsBreakdown({ sale, formatCurrency, paymentLabel }) {
    const discount = Number(sale.discount_total || 0);
    const tax = Number(sale.tax_amount || 0);
    const subtotal = Number(sale.subtotal || 0);
    const showBreakdown = subtotal > 0 || discount > 0 || tax > 0;

    return (
        <div className="receipt-totals-box">
            {showBreakdown && (
                <>
                    <div className="receipt-totals-row">
                        <span>Sub Total</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="receipt-totals-row">
                            <span>Potongan</span>
                            <span>- {formatCurrency(discount)}</span>
                        </div>
                    )}
                    {tax > 0 && (
                        <div className="receipt-totals-row">
                            <span>Pajak{sale.tax_percent ? ` ${Number(sale.tax_percent)}%` : ''}</span>
                            <span>{formatCurrency(tax)}</span>
                        </div>
                    )}
                </>
            )}
            <div className="receipt-totals-row is-grand">
                <span>TOTAL</span>
                <span>{formatCurrency(sale.total_amount)}</span>
            </div>
            {sale.amount_paid > 0 && (
                <>
                    <div className="receipt-totals-row">
                        <span>{paymentLabel}</span>
                        <span>{formatCurrency(sale.amount_paid)}</span>
                    </div>
                    <div className="receipt-totals-row">
                        <span>Kembali</span>
                        <span>{formatCurrency(sale.change_amount)}</span>
                    </div>
                </>
            )}
        </div>
    );
}

export function saleItemLineTotal(item) {
    return lineTotal({
        unit_price: item.unit_price,
        quantity: item.quantity,
        discount_percent: item.discount_percent,
    });
}
