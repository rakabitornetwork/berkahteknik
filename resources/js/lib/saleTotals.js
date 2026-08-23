function clampPercent(value) {
    const n = Number(value || 0);
    if (Number.isNaN(n)) return 0;
    return Math.min(100, Math.max(0, n));
}

export function roundMoney(amount) {
    return Math.round((Number(amount || 0) + Number.EPSILON) * 100) / 100;
}

export function lineTotal(item) {
    const gross = Number(item.unit_price || 0) * Number(item.quantity || 0);
    return roundMoney(gross * (1 - clampPercent(item.discount_percent) / 100));
}

export function computeSaleTotals({
    items = [],
    discount_percent = 0,
    discount_amount = 0,
    tax_enabled = false,
    tax_percent = 0,
} = {}) {
    const subtotal = roundMoney(items.reduce((sum, item) => sum + lineTotal(item), 0));
    const percentDiscount = roundMoney(subtotal * (clampPercent(discount_percent) / 100));
    const discountTotal = Math.min(subtotal, roundMoney(percentDiscount + Math.max(0, Number(discount_amount || 0))));
    const taxable = Math.max(0, roundMoney(subtotal - discountTotal));
    const taxAmount = tax_enabled ? roundMoney(taxable * (clampPercent(tax_percent) / 100)) : 0;

    return {
        subtotal,
        discount_total: discountTotal,
        tax_amount: taxAmount,
        grand_total: roundMoney(taxable + taxAmount),
    };
}
