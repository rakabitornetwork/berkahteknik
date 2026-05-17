import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Printer, ArrowLeft, CheckCircle, Clock, DollarSign } from 'lucide-react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function SalesShow({ sale }) {
    const { data, setData, patch, processing, reset } = useForm({
        amount_paid: ''
    });

    const formatCurrency = (amount) => `Rp ${Number(amount).toLocaleString('id-ID')}`;

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
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => window.print()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Printer size={16} /> Cetak Nota
                    </button>
                </div>
            </div>

            <div className="hd-grid hd-grid-cols-3" style={{ gap: '1.5rem' }}>
                
                {/* Informasi Transaksi */}
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
                            <div style={{ fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize' }}>{sale.payment_method || '-'}</div>
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

                {/* Struk / Daftar Belanja */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div className="glass-panel printable-area" style={{ padding: '2rem' }}>
                        
                        {/* Header Struk (Only visible in print ideally, but good for display too) */}
                        <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px dashed var(--color-border)' }}>
                            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>BERKAH TEKNIK AC</h1>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                Penjualan Spare Part<br />
                                {new Date(sale.created_at).toLocaleDateString('id-ID')}
                            </p>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem 0.5rem' }}>Barang</th>
                                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Qty</th>
                                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Harga</th>
                                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.items.map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>
                                            <div style={{ fontWeight: 600 }}>{item.spare_part.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.spare_part.code}</div>
                                        </td>
                                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>{formatCurrency(item.unit_price)}</td>
                                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.unit_price * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                            <div style={{ width: '300px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', fontSize: '1.25rem', fontWeight: 700, borderTop: '2px dashed var(--color-border)' }}>
                                    <span>TOTAL</span>
                                    <span>{formatCurrency(sale.total_amount)}</span>
                                </div>
                                {sale.amount_paid > 0 && (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                            <span>Tunai</span>
                                            <span>{formatCurrency(sale.amount_paid)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                            <span>Kembali</span>
                                            <span>{formatCurrency(sale.change_amount)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            <p>Terima kasih atas pembelian Anda!</p>
                            <p>Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan.</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body * { visibility: hidden; }
                    .printable-area, .printable-area * { visibility: visible; }
                    .printable-area { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; background: transparent !important; color: #000 !important; }
                    .admin-sidebar, header, .btn { display: none !important; }
                }
            `}} />
        </AdminLayout>
    );
}
