import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Wallet } from 'lucide-react';
import AdminLayout from '../../../../Layouts/AdminLayout';
import PosTabs from '../PosTabs';
import { formatReceiptNumber } from '../../../../lib/receiptNumber';
import { salePaymentLabel } from '../../../../lib/salePaymentLabels';

function formatCurrency(amount) {
    return `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;
}

export default function PosV2Piutang({ groups = [] }) {
    const [openKey, setOpenKey] = useState(groups[0] ? 0 : -1);
    const [payForm, setPayForm] = useState({ saleId: '', amount: '', payment_method: 'cash' });

    const totalDue = useMemo(
        () => groups.reduce((sum, group) => sum + Number(group.total_due || 0), 0),
        [groups]
    );

    const submitPay = (e) => {
        e.preventDefault();
        if (!payForm.saleId) return;
        router.patch(`/admin/sales/v2/${payForm.saleId}/pay`, {
            amount_paid: payForm.amount,
            payment_method: payForm.payment_method,
        }, {
            preserveScroll: true,
            onSuccess: () => setPayForm({ saleId: '', amount: '', payment_method: 'cash' }),
        });
    };

    return (
        <AdminLayout title="Piutang POS v2">
            <Head title="Piutang POS v2" />

            <div className="pos-desk pos-desk-list pos-v2">
                <PosTabs active="piutang" />
            </div>

            <div className="glass-panel list-panel" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            Total piutang pelanggan
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 700 }}>
                            {formatCurrency(totalDue)}
                        </div>
                    </div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                        {groups.length} pelanggan memiliki invoice belum lunas
                    </div>
                </div>
            </div>

            {groups.length === 0 ? (
                <div className="glass-panel list-panel list-empty-state">
                    <Wallet size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                    <p>Tidak ada piutang penjualan.</p>
                </div>
            ) : (
                <div className="pos-v2-piutang-grid">
                    <div className="glass-panel list-panel">
                        {groups.map((group, index) => (
                            <button
                                key={`${group.customer_id || group.customer_name}-${index}`}
                                type="button"
                                className={`pos-v2-piutang-row${openKey === index ? ' is-active' : ''}`}
                                onClick={() => {
                                    setOpenKey(index);
                                    setPayForm({ saleId: '', amount: '', payment_method: 'cash' });
                                }}
                            >
                                <span>
                                    <strong>{group.customer_name}</strong>
                                    <small>{group.invoice_count} invoice</small>
                                </span>
                                <strong>{formatCurrency(group.total_due)}</strong>
                            </button>
                        ))}
                    </div>

                    {openKey >= 0 && groups[openKey] && (
                        <div className="glass-panel list-panel">
                            <h3 style={{ marginTop: 0 }}>{groups[openKey].customer_name}</h3>
                            <table className="pos-grid">
                                <thead>
                                    <tr>
                                        <th>No. Nota</th>
                                        <th>Tanggal</th>
                                        <th>Metode</th>
                                        <th>Sisa</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups[openKey].invoices.map((invoice) => (
                                        <tr
                                            key={invoice.id}
                                            className={String(payForm.saleId) === String(invoice.id) ? 'is-selected' : ''}
                                            onClick={() => setPayForm({
                                                saleId: invoice.id,
                                                amount: String(invoice.due),
                                                payment_method: 'cash',
                                            })}
                                        >
                                            <td className="is-code">{formatReceiptNumber(invoice.receipt_number, invoice.sold_at)}</td>
                                            <td>{new Date(invoice.sold_at).toLocaleString('id-ID')}</td>
                                            <td>{salePaymentLabel(invoice.payment_method)}</td>
                                            <td className="is-num">{formatCurrency(invoice.due)}</td>
                                            <td>
                                                <Link href={`/admin/sales/${invoice.id}`} onClick={(e) => e.stopPropagation()}>
                                                    <Eye size={16} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {payForm.saleId && (
                                <form onSubmit={submitPay} className="pos-v2-piutang-pay">
                                    <label className="pos-field">
                                        <span>Metode</span>
                                        <select
                                            className="form-input"
                                            value={payForm.payment_method}
                                            onChange={(e) => setPayForm((prev) => ({ ...prev, payment_method: e.target.value }))}
                                        >
                                            <option value="cash">Tunai</option>
                                            <option value="bank">Bank</option>
                                            <option value="emoney">E-Money</option>
                                        </select>
                                    </label>
                                    <label className="pos-field">
                                        <span>Nominal bayar</span>
                                        <input
                                            type="number"
                                            min="0.01"
                                            step="100"
                                            className="form-input"
                                            value={payForm.amount}
                                            onChange={(e) => setPayForm((prev) => ({ ...prev, amount: e.target.value }))}
                                            required
                                        />
                                    </label>
                                    <button type="submit" className="btn btn-primary">Bayar</button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
