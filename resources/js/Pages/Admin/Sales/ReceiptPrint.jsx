import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import ReceiptHeader, { PaidWatermark } from '../../../Components/ReceiptHeader';
import ThermalPrintButton from '../../../Components/ThermalPrintButton';

const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

export default function ReceiptPrint({ sale, shop }) {
    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('print') === '1') {
            const t = setTimeout(() => window.print(), 400);
            return () => clearTimeout(t);
        }
    }, []);

    const paymentLabel = { cash: 'Tunai', transfer: 'Transfer Bank', qris: 'QRIS' }[sale.payment_method] || sale.payment_method;
    const items = sale.items ?? [];

    const handleClose = () => {
        const goToSale = () => router.visit(`/admin/sales/${sale.id}`);

        if (window.opener && !window.opener.closed) {
            window.close();
            setTimeout(() => {
                if (!window.closed) goToSale();
            }, 150);
            return;
        }

        if (window.history.length > 1) {
            window.history.back();
            return;
        }

        goToSale();
    };

    return (
        <>
            <Head title={`Nota ${sale.receipt_number}`} />
            <style>{`
                .receipt-print-shell {
                    min-height: 100vh;
                    background: #eef2f6;
                    font-family: 'Inter', system-ui, sans-serif;
                    --receipt-width: min(80rem, calc(100vw - 1rem));
                }
                .receipt-print-toolbar {
                    display: flex;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 0.85rem 1rem;
                    max-width: var(--receipt-width);
                    margin: 0 auto;
                }
                .receipt-print-toolbar button {
                    font-size: 0.8125rem;
                    padding: 0.45rem 1.1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                }
                .receipt-print-toolbar .btn-print {
                    border: none;
                    background: #2563eb;
                    color: white;
                }
                .receipt-print-toolbar .btn-back {
                    background: white;
                    border: 1px solid #cbd5e1;
                    color: #334155;
                }
                .receipt-print-toolbar .btn-thermal {
                    background: #0f766e;
                    border: none;
                    color: white;
                }
                .receipt-print-body {
                    padding: 0 1rem 1.25rem;
                    max-width: var(--receipt-width);
                    margin: 0 auto;
                }
                .receipt-premium.print-page {
                    width: 100%;
                    max-width: 100%;
                    padding: 1.15rem 1.5rem;
                    border-radius: 4px;
                    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.06);
                }
                .receipt-premium .receipt-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.8125rem;
                    margin-bottom: 0.75rem;
                }
                .receipt-premium .receipt-table thead tr {
                    border-bottom: 1px solid #cbd5e1;
                }
                .receipt-premium .receipt-table th {
                    padding: 0.35rem 0.45rem;
                    font-size: 0.65rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #64748b;
                }
                .receipt-premium .receipt-table td {
                    padding: 0.4rem 0.45rem;
                    border-bottom: 1px solid #f1f5f9;
                    vertical-align: top;
                }
                .receipt-premium .receipt-table .item-code {
                    font-size: 0.68rem;
                    color: #94a3b8;
                    margin-top: 0.1rem;
                }
                .receipt-premium .receipt-totals {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 0.65rem;
                }
                .receipt-premium .receipt-totals-box {
                    width: min(280px, 42%);
                }
                .receipt-premium .receipt-totals-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.2rem 0;
                    font-size: 0.8125rem;
                    color: #475569;
                }
                .receipt-premium .receipt-totals-row.is-grand {
                    padding-top: 0.45rem;
                    margin-top: 0.25rem;
                    border-top: 1px solid #cbd5e1;
                    font-size: 1rem;
                    font-weight: 700;
                    color: #0f172a;
                }
                .receipt-premium .receipt-footer {
                    text-align: center;
                    margin-top: 0.85rem;
                    padding-top: 0.65rem;
                    border-top: 1px solid #f1f5f9;
                    font-size: 0.7rem;
                    color: #64748b;
                    line-height: 1.45;
                    white-space: pre-line;
                }
                @media print {
                    .no-print { display: none !important; }
                    .receipt-print-shell { background: white !important; min-height: auto !important; }
                    html, body { background: white !important; margin: 0 !important; }
                    body, body * { visibility: visible !important; }
                    .receipt-premium.print-page {
                        box-shadow: none !important;
                        margin: 0 !important;
                        max-width: 100% !important;
                        padding: 0 !important;
                        border-radius: 0 !important;
                    }
                }
                @page { margin: 10mm; }
            `}</style>

            <div className="receipt-print-shell">
                <div className="receipt-print-toolbar no-print">
                    <ThermalPrintButton
                        sale={sale}
                        shop={shop}
                        className="btn-thermal"
                        style={{ fontSize: '0.8125rem', padding: '0.45rem 1.1rem', borderRadius: '8px' }}
                    />
                    <button type="button" className="btn-print" onClick={() => window.print()}>
                        <Printer size={16} /> Cetak Browser
                    </button>
                    <button type="button" className="btn-back" onClick={handleClose}>
                        Kembali
                    </button>
                </div>

                <ReceiptBody sale={sale} shop={shop} items={items} paymentLabel={paymentLabel} />
            </div>
        </>
    );
}

function ReceiptBody({ sale, shop, items, paymentLabel }) {
    return (
        <div className="receipt-print-body">
            <div className="print-page receipt-sheet receipt-premium" style={{ position: 'relative', margin: '0 auto', background: 'white', color: '#111' }}>
                {sale.payment_status === 'lunas' && <PaidWatermark />}

                <ReceiptHeader
                    shop={shop}
                    dark
                    receiptNumber={sale.receipt_number}
                    transactionDate={sale.created_at}
                    customerName={sale.customer_name}
                />

                <table className="receipt-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Barang</th>
                            <th style={{ textAlign: 'center', width: '4rem' }}>Qty</th>
                            <th style={{ textAlign: 'right', width: '7rem' }}>Harga</th>
                            <th style={{ textAlign: 'right', width: '7.5rem' }}>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? items.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.spare_part?.name ?? '-'}</div>
                                    {item.spare_part?.code && <div className="item-code">{item.spare_part.code}</div>}
                                </td>
                                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right' }}>{fmt(item.unit_price)}</td>
                                <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(item.unit_price * item.quantity)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} style={{ color: '#94a3b8', fontStyle: 'italic', padding: '0.5rem 0' }}>
                                    Tidak ada item
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="receipt-totals">
                    <TotalsBox sale={sale} paymentLabel={paymentLabel} />
                </div>

                <div className="receipt-footer">
                    {shop?.receipt_footer || 'Terima kasih atas pembelian Anda.'}
                </div>
            </div>
        </div>
    );
}

function TotalsBox({ sale, paymentLabel }) {
    return (
        <div className="receipt-totals-box">
            <div className="receipt-totals-row is-grand">
                <span>TOTAL</span>
                <span>{fmt(sale.total_amount)}</span>
            </div>
            {sale.amount_paid > 0 && (
                <>
                    <div className="receipt-totals-row">
                        <span>{paymentLabel}</span>
                        <span>{fmt(sale.amount_paid)}</span>
                    </div>
                    <div className="receipt-totals-row">
                        <span>Kembali</span>
                        <span>{fmt(sale.change_amount)}</span>
                    </div>
                </>
            )}
        </div>
    );
}

