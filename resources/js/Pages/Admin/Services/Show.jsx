import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import StatusBadge from '../../../Components/StatusBadge';
import { CheckCircle, Clock, Check, Wrench, CreditCard, ArrowLeft, Printer, FileText } from 'lucide-react';

const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

export default function ServiceShow({ service }) {
    const { shop } = usePage().props;
    const partsTotal = service.spare_parts?.reduce((sum, p) => sum + (p.pivot.quantity * p.pivot.unit_price), 0) || 0;
    const grandTotal = partsTotal + Number(service.service_fee || 0);
    const payments = service.payments || [];
    const paidTotal = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const balanceDue = Math.max(0, grandTotal - paidTotal);
    const [paymentForm, setPaymentForm] = useState({ amount: balanceDue || '', payment_method: 'cash', notes: '' });
    const [cashReceived, setCashReceived] = useState('');

    const handleDelete = () => {
        const label = service.spk_number || `Servis #${String(service.id).padStart(4, '0')}`;
        if (!window.confirm(`Yakin ingin menghapus ${label}? Data tidak dapat dikembalikan.`)) {
            return;
        }
        router.delete(`/admin/services/${service.id}`);
    };

    return (
        <AdminLayout title={`Detail Servis #${String(service.id).padStart(4, '0')}`}>
            <Head title={`Servis #${service.id}`} />

            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Header Card */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <Link href="/admin/services" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><ArrowLeft size={14} /> Kembali ke Daftar</Link>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>
                                Servis #{String(service.id).padStart(4, '0')}
                            </h2>
                            {service.spk_number && (
                                <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.35rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <FileText size={14} /> {service.spk_number}
                                </div>
                            )}
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                Masuk: {new Date(service.created_at).toLocaleString('id-ID')}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <StatusBadge status={service.status} />
                            <a href={`/admin/services/${service.id}/spk?print=1`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Printer size={14} /> Cetak SPK
                            </a>
                            <a href={`/admin/services/${service.id}/invoice?print=1`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Printer size={14} /> Cetak Invoice
                            </a>
                            <Link href={`/admin/services/${service.id}/edit`} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Edit</Link>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {/* Pelanggan & Kendaraan */}
                    <div className="glass-panel" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem' }}>Kendaraan & Pelanggan</h3>
                        <InfoRow label="Pelanggan" value={service.vehicle?.customer?.name} />
                        <InfoRow label="Telepon" value={service.vehicle?.customer?.phone} />
                        <InfoRow label="Kendaraan" value={`${service.vehicle?.brand} ${service.vehicle?.model}`} />
                        <InfoRow label="Plat Nomor" value={service.vehicle?.license_plate} bold />
                        <InfoRow label="Tahun" value={service.vehicle?.year || '-'} />
                    </div>

                    {/* Penanganan */}
                    <div className="glass-panel" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem' }}>Info Penanganan</h3>
                        <InfoRow label="Teknisi" value={service.technician?.name || 'Belum ditugaskan'} />
                        <InfoRow label="Status" value={<StatusBadge status={service.status} />} />
                        <InfoRow label="Mulai" value={service.started_at ? new Date(service.started_at).toLocaleString('id-ID') : '-'} />
                        <InfoRow label="Selesai" value={service.completed_at ? new Date(service.completed_at).toLocaleString('id-ID') : '-'} />
                        <InfoRow label="Pembayaran" value={
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, color: service.payment_status === 'lunas' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                                {service.payment_status === 'lunas' ? <><CheckCircle size={14} strokeWidth={2.5}/> Lunas</> : <><Clock size={14} strokeWidth={2.5}/> Belum Lunas</>}
                            </span>
                        } />
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem' }}>Informasi Garansi</h3>
                    <InfoRow label="Masa Garansi" value={`${service.effective_warranty_months} bulan`} />
                    {service.status === 'selesai' && (
                        <>
                            <InfoRow label="Mulai Garansi" value={service.warranty_starts_at ? new Date(service.warranty_starts_at).toLocaleDateString('id-ID') : (service.completed_at ? new Date(service.completed_at).toLocaleDateString('id-ID') : '-')} />
                            <InfoRow label="Berlaku Hingga" value={service.warranty_expires_at ? new Date(service.warranty_expires_at).toLocaleDateString('id-ID') : '-'} />
                            <InfoRow label="Status" value={
                                <span style={{ fontWeight: 600, color: service.has_active_warranty ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                                    {service.has_active_warranty ? 'Garansi Aktif' : 'Garansi Berakhir / Tidak Berlaku'}
                                </span>
                            } />
                        </>
                    )}
                    {service.warranty_notes && <InfoRow label="Catatan" value={service.warranty_notes} />}
                    {service.warranty_terms && <InfoRow label="Syarat Khusus" value={service.warranty_terms} />}
                    {shop?.warranty_policy && (
                        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'pre-line', padding: '0.75rem', background: 'rgba(0,0,0,0.12)', borderRadius: 'var(--radius-md)' }}>
                            <strong style={{ color: 'var(--color-text-main)' }}>Kebijakan garansi umum:</strong><br />{shop.warranty_policy}
                        </div>
                    )}
                </div>

                {/* Keluhan & Diagnosa */}
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem' }}>Keluhan & Diagnosa</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>KELUHAN PELANGGAN</div>
                            <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{service.description}</div>
                            {service.work_instructions && (
                                <div style={{
                                    marginTop: '0.75rem',
                                    padding: '0.625rem 0.75rem',
                                    background: 'rgba(245, 158, 11, 0.12)',
                                    border: '1px solid rgba(251, 191, 36, 0.4)',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    lineHeight: 1.6,
                                    color: 'var(--color-text-main)',
                                }}>
                                    <strong style={{ color: 'var(--color-warning)' }}>Instruksi kerja:</strong>{' '}
                                    {service.work_instructions}
                                </div>
                            )}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>JENIS JASA & DIAGNOSA</div>
                            <div style={{ fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{service.service_name}</div>
                            <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{service.diagnosis || <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Belum ada diagnosa</span>}</div>
                            {service.mechanic_notes && (
                                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                                    <strong>Catatan mekanik:</strong> {service.mechanic_notes}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Spare Parts & Invoice */}
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>Spare Part & Rincian Biaya</h3>
                        {(service.is_bring_own_part === 1 || service.is_bring_own_part === true) && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-info)', background: 'rgba(14, 165, 233, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
                                [Catatan Resmi: Pelanggan Menggunakan Spare Part Bawaan Sendiri]
                            </span>
                        )}
                    </div>
                    <table className="hd-table" style={{ marginBottom: '1rem' }}>
                        <thead>
                            <tr>
                                <th>Nama Spare Part</th>
                                <th style={{ textAlign: 'center' }}>Qty</th>
                                <th style={{ textAlign: 'right' }}>Harga Satuan</th>
                                <th style={{ textAlign: 'right' }}>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {service.spare_parts?.length > 0 ? service.spare_parts.map((p, i) => (
                                <tr key={i}>
                                    <td>{p.name}</td>
                                    <td style={{ textAlign: 'center' }}>{p.pivot.quantity} {p.unit}</td>
                                    <td style={{ textAlign: 'right' }}>{fmt(p.pivot.unit_price)}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 500 }}>{fmt(p.pivot.quantity * p.pivot.unit_price)}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Tidak ada spare part</td></tr>
                            )}
                            <tr style={{ borderTop: '2px solid var(--color-border)' }}>
                                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 500, paddingTop: '0.75rem' }}>Biaya Jasa</td>
                                <td style={{ textAlign: 'right', paddingTop: '0.75rem' }}>{fmt(service.service_fee)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary-dark)' }}>TOTAL</td>
                                <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary-dark)' }}>{fmt(grandTotal)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                        <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', fontWeight: 700 }}>Riwayat Pembayaran Servis</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <InfoMini label="Total Invoice" value={fmt(grandTotal)} />
                            <InfoMini label="Sudah Dibayar" value={fmt(paidTotal)} />
                            <InfoMini label="Sisa Tagihan" value={fmt(balanceDue)} />
                        </div>
                        {payments.length > 0 && (
                            <table className="hd-table" style={{ marginBottom: '0.75rem' }}>
                                <thead>
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Metode</th>
                                        <th>Catatan</th>
                                        <th style={{ textAlign: 'right' }}>Nominal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(payment => (
                                        <tr key={payment.id}>
                                            <td>{payment.payment_date}</td>
                                            <td>{payment.payment_method || '-'}</td>
                                            <td>{payment.notes || '-'}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(payment.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {balanceDue > 0 && service.status === 'selesai' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                                <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>Catat Pembayaran Cepat</h5>
                                <form onSubmit={e => { e.preventDefault(); router.post('/admin/service-payments', { service_id: service.id, ...paymentForm }); }} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr auto', gap: '0.5rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>NOMINAL BAYAR (KAS)</span>
                                            <input className="form-input" type="number" min="1" value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="Nominal" required />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>METODE</span>
                                            <select className="form-input" value={paymentForm.payment_method} onChange={e => { setPaymentForm({ ...paymentForm, payment_method: e.target.value }); setCashReceived(''); }}>
                                                <option value="cash">Tunai</option>
                                                <option value="transfer">Transfer</option>
                                                <option value="qris">QRIS</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>CATATAN</span>
                                            <input className="form-input" value={paymentForm.notes} onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })} placeholder="Catatan pembayaran" />
                                        </div>
                                        <div style={{ display: 'flex', alignSelf: 'end' }}>
                                            <button className="btn btn-primary" type="submit" style={{ height: '2.5rem' }}>Catat Bayar</button>
                                        </div>
                                    </div>

                                    {paymentForm.payment_method === 'cash' && (
                                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(59, 130, 246, 0.05)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(59, 130, 246, 0.2)', marginTop: '0.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>UANG FISIK DITERIMA:</span>
                                                <input 
                                                    className="form-input" 
                                                    type="number" 
                                                    value={cashReceived} 
                                                    onChange={e => setCashReceived(e.target.value)} 
                                                    placeholder="Contoh: 100000" 
                                                    style={{ width: '150px', height: '2.2rem', fontSize: '0.85rem', padding: '0.25rem 0.5rem' }} 
                                                />
                                            </div>
                                            {Number(cashReceived) > 0 && (
                                                <div style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>UANG KEMBALIAN:</span>
                                                    <span style={{ color: Number(cashReceived) - Number(paymentForm.amount) >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                                        {fmt(Math.max(0, Number(cashReceived) - Number(paymentForm.amount)))}
                                                        {Number(cashReceived) - Number(paymentForm.amount) < 0 && ' (Kurang)'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Status Update Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px dashed var(--color-border)', flexWrap: 'wrap' }}>
                        {service.status === 'antri' && (
                            <button onClick={() => router.patch(`/admin/services/${service.id}/status`, { status: 'dikerjakan' })}
                                className="btn btn-primary" style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                                <Wrench size={16} /> Mulai Pengerjaan
                            </button>
                        )}
                        {service.status === 'dikerjakan' && (
                            <button onClick={() => router.patch(`/admin/services/${service.id}/status`, { status: 'selesai' })}
                                className="btn btn-primary" style={{ fontSize: '0.85rem', background: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                                <Check size={16} /> Tandai Selesai
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleDelete}
                            className="btn btn-outline"
                            style={{ fontSize: '0.85rem', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', marginLeft: 'auto' }}
                        >
                            Hapus Servis
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function InfoRow({ label, value, bold }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem', gap: '1rem' }}>
            <span style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>{label}</span>
            <span style={{ fontWeight: bold ? 700 : 400, textAlign: 'right' }}>{value}</span>
        </div>
    );
}

function InfoMini({ label, value }) {
    return (
        <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>{label}</div>
            <div style={{ fontWeight: 800, marginTop: '0.2rem' }}>{value}</div>
        </div>
    );
}

