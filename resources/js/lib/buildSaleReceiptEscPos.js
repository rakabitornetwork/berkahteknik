import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';
import { getPaperColumns, getPaperWidth } from './thermalPrinterStorage';

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
        const subtotal = price * qty;

        e = e.bold(true).line(name).bold(false);
        if (code) {
            e = e.line(code);
        }
        e = e.table(
            [
                { width: nameCol, align: 'left' },
                { width: priceCol, align: 'right' },
            ],
            [[`${qty} x ${fmt(price)}`, fmt(subtotal)]],
        );
    }

    if (items.length === 0) {
        e = e.line('(Tidak ada item)');
    }

    e = e.rule({ style: 'single' });

    e = e.table(
        [
            { width: Math.floor(cols * 0.35), align: 'left' },
            { width: cols - Math.floor(cols * 0.35), align: 'right' },
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

    const footer = shop?.receipt_footer || 'Terima kasih atas pembelian Anda.';
    e = e
        .newline()
        .align('center')
        .line(footer)
        .newline(3)
        .cut();

    return e.encode();
}
