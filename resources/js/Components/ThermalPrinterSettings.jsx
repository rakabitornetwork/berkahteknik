import React from 'react';
import { Bluetooth, Loader2, Printer } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useThermalPrinter } from '../hooks/useThermalPrinter';

export default function ThermalPrinterSettings() {
    const { shop } = usePage().props;
    const {
        supported,
        connected,
        deviceName,
        busy,
        error,
        paperWidth,
        setPaperWidth,
        connect,
        printTest,
        clearError,
    } = useThermalPrinter();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                Cetak struk langsung ke printer thermal Bluetooth (ESC/POS) dari Chrome atau Edge.
                Pastikan printer sudah dipasangkan di sistem, lalu klik hubungkan.
            </p>

            {!supported && (
                <div style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    background: 'rgba(234, 179, 8, 0.12)',
                    color: '#a16207',
                    border: '1px solid rgba(234, 179, 8, 0.35)',
                }}>
                    Browser ini tidak mendukung Web Bluetooth. Gunakan Chrome/Edge di HTTPS atau localhost.
                </div>
            )}

            <div>
                <label className="form-label">Lebar kertas struk</label>
                <select
                    className="form-input"
                    value={String(paperWidth)}
                    onChange={(e) => setPaperWidth(Number(e.target.value))}
                    style={{ maxWidth: '12rem' }}
                >
                    <option value="58">58 mm</option>
                    <option value="80">80 mm</option>
                </select>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <button
                    type="button"
                    className="btn btn-outline"
                    disabled={!supported || busy}
                    onClick={() => { clearError(); connect(); }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                    {busy ? <Loader2 size={16} className="spin" /> : <Bluetooth size={16} />}
                    {connected ? 'Hubungkan Ulang' : 'Hubungkan Printer'}
                </button>
                <button
                    type="button"
                    className="btn btn-outline"
                    disabled={!supported || busy}
                    onClick={() => { clearError(); printTest(shop); }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                    <Printer size={16} /> Cetak Test
                </button>
                {deviceName && (
                    <span style={{ fontSize: '0.8rem', color: connected ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                        {connected ? 'Terhubung: ' : 'Terakhir: '}{deviceName}
                    </span>
                )}
            </div>

            {error && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{error}</div>
            )}
        </div>
    );
}
