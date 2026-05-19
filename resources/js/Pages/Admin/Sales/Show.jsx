import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Printer, ArrowLeft, CheckCircle, Clock, DollarSign } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import ReceiptHeader, { PaidWatermark } from '../../../Components/ReceiptHeader';
import ThermalPrintButton from '../../../Components/ThermalPrintButton';

export default function SalesShow({ sale }) {
    const { shop } = usePage().props;
    const { data, setData, patch, processing, reset } = useForm({
        amount_paid: ''
    });

    const formatCurrency = (amount) => `Rp ${Number(amount).toLocaleString('id-ID')}`;
    const paymentLabel = { cash: 'Tunai', transfer: 'Transfer Bank', qris: 'QRIS' }[sale.payment_method] || sale.payment_method;

    const handlePay = (e) => {
        e.preventDefault();
        patch(`/admin/sales/${sale.id}/pay`, {
            preserveScroll: true,
            onSuccess: () => reset()
        });
    };

    return (
        <AdminLayout title={`Detail Penjualan: ${sale.receipt_number}`}>
            <Head title={`Nota ${sale.receipt_number}`} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/sales" className="btn btn-outline" style={{ padding: '0.4rem' }}>
                        <ArrowLeft size={16} />
                    </Link>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Detail Transaksi</h2>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <ThermalPrintButton sale={sale} shop={shop} />
                    <a
                        href={`/admin/sales/${sale.id}/receipt?print=1`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Printer size={16} /> Cetak Nota
                    </a>
                </div>
            </div>

            <div className="hd-grid hd-grid-cols-3" style={{ gap: '1.5rem' }}>
                <div style={{ gridColumn: 'span 1' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>No. Nota</div>
                            <div style={{ fontSize: '1rem', fontWeight: 600, fontFamily: 'monospace' }}>{sale.receipt_number}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Tanggal & Waktu</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{new Date(sale.created_at).toLocaleString('id-ID')}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Pelanggan</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{sale.customer_name || 'Pelanggan Umum'}</div>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Status Pembayaran</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: sale.payment_status === 'lunas' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                {sale.payment_status === 'lunas' ? <CheckCircle size={18} /> : <Clock size={18} />}
                                {sale.payment_status === 'lunas' ? 'LUNAS' : 'BELUM LUNAS'}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Metode</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize' }}>{paymentLabel || '-'}</div>
                        </div>
                    </div>

                    {sale.payment_status === 'belum_lunas' && (
                        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <h3 style={{ fontSize: '1rem', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <DollarSign size={18} /> Sisa Tagihan: {formatCurrency(sale.total_amount - sale.amount_paid)}
                            </h3>
                            <form onSubmit={handlePay} style={{ display: 'flex', gap: '0.75rem' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>Rp</span>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Nominal bayar..."
                                        value={data.amount_paid}
                                        onChange={e => setData('amount_paid', e.target.value)}
                                        style={{ paddingLeft: '2.5rem' }}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={processing}>
                                    Bayar
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                    <div className="glass-panel printable-area receipt-sheet receipt-premium" style={{ position: 'relative', background: '#fff' }}>
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
                                {sale.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.spare_part.name}</div>
                                            <div className="item-code">{item.spare_part.code}</div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ textAlign: 'right' }}>{formatCurrency(item.unit_price)}</td>
                                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.unit_price * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="receipt-totals">
                            <div className="receipt-totals-box">
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
                        </div>

                        <div className="receipt-footer">
                            {shop?.receipt_footer || 'Terima kasih atas pembelian Anda.'}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
