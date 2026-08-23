import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';
import { warrantyText } from './warrantyText';
import { lineTotal } from './saleTotals';
import { getPaperColumns, getPaperWidth } from './thermalPrinterStorage';

function wrapReceiptText(text, cols) {
    const lines = [];

    String(text || '').replace(/\r/g, '').split('\n').forEach((paragraph) => {
        const words = paragraph.trim().split(/\s+/).filter(Boolean);
        if (words.length === 0) {
            lines.push('');
            return;
        }

        let current = '';
        words.forEach((word) => {
            const next = current ? `${current} ${word}` : word;
            if (next.length <= cols) {
                current = next;
                return;
            }
            if (current) lines.push(current);
            current = word.length <= cols ? word : word.slice(0, cols);
        });
        if (current) lines.push(current);
    });

    return lines;
}

const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

function itemName(item) {
    return item.spare_part?.name ?? item.sparePart?.name ?? '-';
}

function itemCode(item) {
    return item.spare_part?.code ?? item.sparePart?.code ?? null;
}

/**
 * @param {{ sale: object, shop: object, paymentLabel?: string, printerLanguage?: string, codepageMapping?: string, paperWidth?: number }} opts
 */
export function buildSaleReceiptEscPos({
    sale,
    shop,
    paymentLabel = '',
    hidePrices = false,
    printerLanguage = 'esc-pos',
    codepageMapping = 'epson',
    paperWidth = getPaperWidth(),
}) {
    const cols = getPaperColumns(paperWidth);
    const items = sale.items ?? [];

    const encoder = new ReceiptPrinterEncoder({
        language: printerLanguage,
        codepageMapping,
        columns: cols,
    });

    const shopName = shop?.legal_name || shop?.app_name || 'Bengkel';
    const dateStr = sale.created_at
        ? new Date(sale.created_at).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : '';

    const contact = [
        shop?.phone && `Telp ${shop.phone}`,
        shop?.whatsapp && `WA ${shop.whatsapp}`,
    ].filter(Boolean).join(' · ');

    let e = encoder
        .initialize()
        .align('center')
        .bold(true)
        .line(shopName)
        .bold(false);

    if (shop?.tagline) {
        e = e.line(shop.tagline);
    }
    if (shop?.address) {
        e = e.line(shop.address);
    }
    if (contact) {
        e = e.line(contact);
    }

    e = e
        .rule({ style: 'single' })
        .align('left')
        .line(`No  : ${sale.receipt_number}`)
        .line(`Tgl : ${dateStr}`)
        .line(`Plg : ${sale.customer_name || 'Pelanggan Umum'}`)
        .rule({ style: 'single' })
        .newline();

    const nameCol = Math.max(12, Math.floor(cols * 0.58));
    const priceCol = cols - nameCol;

    for (const item of items) {
        const name = itemName(item);
        const code = itemCode(item);
        const qty = item.quantity;
        const price = item.unit_price;
        const disc = Number(item.discount_percent || 0);
        const subtotal = lineTotal(item);

        e = e.bold(true).line(name).bold(false);
        if (code) {
            e = e.line(code);
        }
        if (hidePrices) {
            e = e.line(`Qty: ${qty}`);
        } else {
            e = e.table(
                [
                    { width: nameCol, align: 'left' },
                    { width: priceCol, align: 'right' },
                ],
                [[`${qty} x ${fmt(price)}${disc > 0 ? ` pot ${disc}%` : ''}`, fmt(subtotal)]],
            );
        }
    }

    if (items.length === 0) {
        e = e.line('(Tidak ada item)');
    }

    e = e.rule({ style: 'single' });

    const leftW = Math.floor(cols * 0.35);
    const rightW = cols - leftW;
    const moneyRows = [];

    if (!hidePrices && Number(sale.subtotal || 0) > 0) {
        moneyRows.push(['Sub Total', fmt(sale.subtotal)]);
    }
    if (!hidePrices && Number(sale.discount_total || 0) > 0) {
        moneyRows.push(['Potongan', `- ${fmt(sale.discount_total)}`]);
    }
    if (!hidePrices && Number(sale.tax_amount || 0) > 0) {
        const taxLabel = sale.tax_percent ? `Pajak ${Number(sale.tax_percent)}%` : 'Pajak';
        moneyRows.push([taxLabel, fmt(sale.tax_amount)]);
    }

    if (moneyRows.length) {
        e = e.table(
            [
                { width: leftW, align: 'left' },
                { width: rightW, align: 'right' },
            ],
            moneyRows,
        );
    }

    e = e.table(
        [
            { width: leftW, align: 'left' },
            { width: rightW, align: 'right' },
        ],
        [
            [
                (enc) => enc.bold(true).text('TOTAL'),
                (enc) => enc.bold(true).text(fmt(sale.total_amount)),
            ],
        ],
    );

    if (sale.amount_paid > 0 && paymentLabel) {
        e = e
            .line(`${paymentLabel}: ${fmt(sale.amount_paid)}`)
            .line(`Kembali: ${fmt(sale.change_amount ?? 0)}`);
    }

    if (sale.payment_status === 'lunas') {
        e = e
            .newline()
            .align('center')
            .bold(true)
            .line('LUNAS')
            .bold(false);
    }

    const months = Number(shop?.warranty_default_months || 0);
    e = e
        .newline()
        .rule({ style: 'single' })
        .align('left')
        .bold(true)
        .line('Ketentuan Garansi')
        .bold(false);

    if (months > 0) {
        wrapReceiptText(`Masa garansi: ${months} bulan sejak tanggal pembelian.`, cols).forEach((line) => {
            e = e.line(line);
        });
    }

    wrapReceiptText(warrantyText(shop), cols).forEach((line) => {
        e = e.line(line);
    });

    const footer = shop?.receipt_footer || 'Terima kasih atas pembelian Anda.';
    e = e
        .newline()
        .align('center')
        .line(footer)
        .newline(3)
        .cut();

    return e.encode();
}
