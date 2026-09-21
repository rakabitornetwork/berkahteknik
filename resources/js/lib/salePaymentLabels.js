export const SALE_PAYMENT_LABELS = {
    cash: 'Tunai',
    transfer: 'Transfer Bank',
    bank: 'Bank',
    qris: 'QRIS',
    emoney: 'E-Money',
    multi: 'Multi',
    credit: 'Hutang',
};

export function salePaymentLabel(method) {
    if (!method) return '-';
    return SALE_PAYMENT_LABELS[method] || method;
}
