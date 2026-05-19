import React, { useState } from 'react';
import { Bluetooth, Loader2 } from 'lucide-react';
import { useThermalPrinter } from '../hooks/useThermalPrinter';

/**
 * Tombol cetak ke printer thermal Bluetooth (ESC/POS via Web Bluetooth).
 * Wajib dipanggil dari klik pengguna (syarat browser).
 */
export default function ThermalPrintButton({
    sale,
    shop,
    className = 'btn btn-outline',
    style,
    showLabel = true,
    onPrinted,
}) {
    const {
        supported,
        connected,
        deviceName,
        busy,
        error,
        connect,
        printSale,
        clearError,
    } = useThermalPrinter();

    const [localMsg, setLocalMsg] = useState(null);

    const handleClick = async () => {
        clearError();
        setLocalMsg(null);

        if (!supported) {
            setLocalMsg('Gunakan Chrome/Edge + HTTPS. Safari/Firefox belum mendukung Web Bluetooth.');
            return;
        }

        try {
            if (!connected) {
                setLocalMsg('Pilih printer Bluetooth di jendela sistem…');
                await connect();
            }
            setLocalMsg('Mencetak…');
            await printSale(sale, shop);
            setLocalMsg('Terkirim ke printer.');
            onPrinted?.();
            setTimeout(() => setLocalMsg(null), 2500);
        } catch {
            /* error ditampilkan via hook */
        }
    };

    const status = error || localMsg;
    const label = busy
        ? (connected ? 'Mencetak…' : 'Menghubungkan…')
        : (showLabel ? (connected ? 'Cetak Thermal' : 'Hubungkan & Cetak') : '');

    return (
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch', gap: '0.35rem' }}>
            <button
                type="button"
                className={className}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', ...style }}
                onClick={handleClick}
                disabled={busy || !sale}
                title={
                    connected
                        ? `Printer: ${deviceName}`
                        : 'Hubungkan printer thermal Bluetooth (ESC/POS) lalu cetak struk'
                }
            >
                {busy ? <Loader2 size={16} className="spin" /> : <Bluetooth size={16} />}
                {label}
            </button>
            {status && (
                <span style={{
                    fontSize: '0.7rem',
                    color: error ? 'var(--color-danger)' : 'var(--color-text-muted)',
                    maxWidth: '16rem',
                    lineHeight: 1.35,
                }}>
                    {status}
                </span>
            )}
        </div>
    );
}
