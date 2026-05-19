import { useCallback, useEffect, useState } from 'react';
import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';
import { buildSaleReceiptEscPos } from '../lib/buildSaleReceiptEscPos';
import { getPaperColumns } from '../lib/thermalPrinterStorage';
import { thermalPrinterManager } from '../lib/thermalPrinterManager';
import { getPaperWidth, setPaperWidth as persistPaperWidth } from '../lib/thermalPrinterStorage';

const paymentLabels = { cash: 'Tunai', transfer: 'Transfer Bank', qris: 'QRIS' };

export function useThermalPrinter() {
    const [state, setState] = useState(() => thermalPrinterManager.getState());
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [paperWidth, setPaperWidthState] = useState(() => getPaperWidth());

    useEffect(() => thermalPrinterManager.subscribe(setState), []);

    useEffect(() => {
        thermalPrinterManager.reconnectSaved().catch(() => {});
    }, []);

    const setPaperWidth = useCallback((mm) => {
        const width = mm === 58 ? 58 : 80;
        persistPaperWidth(width);
        setPaperWidthState(width);
    }, []);

    const connect = useCallback(async () => {
        setBusy(true);
        setError(null);
        try {
            await thermalPrinterManager.connect();
        } catch (err) {
            const msg = err?.message || 'Gagal menghubungkan printer.';
            setError(msg);
            throw err;
        } finally {
            setBusy(false);
        }
    }, []);

    const resolveDevice = () =>
        thermalPrinterManager.device ?? thermalPrinterManager.getState().savedDevice;

    const printSale = useCallback(async (sale, shop) => {
        setBusy(true);
        setError(null);
        try {
            const paymentLabel = paymentLabels[sale.payment_method] || sale.payment_method || '';
            await thermalPrinterManager.ensureConnected();
            const device = resolveDevice();

            const data = buildSaleReceiptEscPos({
                sale,
                shop,
                paymentLabel,
                printerLanguage: device?.language ?? 'esc-pos',
                codepageMapping: device?.codepageMapping ?? 'epson',
                paperWidth,
            });

            await thermalPrinterManager.print(data);
        } catch (err) {
            const msg = err?.message || 'Gagal mencetak ke printer thermal.';
            setError(msg);
            throw err;
        } finally {
            setBusy(false);
        }
    }, [paperWidth]);

    const printTest = useCallback(async (shop) => {
        setBusy(true);
        setError(null);
        try {
            await thermalPrinterManager.ensureConnected();
            const device = resolveDevice();
            const data = new ReceiptPrinterEncoder({
                language: device?.language ?? 'esc-pos',
                codepageMapping: device?.codepageMapping ?? 'epson',
                columns: getPaperColumns(paperWidth),
            })
                .initialize()
                .align('center')
                .bold(true)
                .line('TEST CETAK')
                .bold(false)
                .line(shop?.legal_name || shop?.app_name || 'Berkah Teknik')
                .line('Printer thermal OK')
                .newline(3)
                .cut()
                .encode();

            await thermalPrinterManager.print(data);
        } catch (err) {
            const msg = err?.message || 'Gagal mencetak test.';
            setError(msg);
            throw err;
        } finally {
            setBusy(false);
        }
    }, [paperWidth]);

    return {
        ...state,
        busy,
        error,
        paperWidth,
        setPaperWidth,
        connect,
        printSale,
        printTest,
        clearError: () => setError(null),
    };
}
