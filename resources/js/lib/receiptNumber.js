export function formatReceiptNumber(number, date) {
    const when = date ? new Date(date) : new Date();
    const valid = !Number.isNaN(when.getTime()) ? when : new Date();
    const stamp = [
        valid.getFullYear(),
        String(valid.getMonth() + 1).padStart(2, '0'),
        String(valid.getDate()).padStart(2, '0'),
    ].join('/');

    const raw = String(number || '').trim();
    if (/^INV-.+-\d{4}\/\d{2}\/\d{2}$/.test(raw)) {
        return raw;
    }

    let code = raw;
    if (raw.startsWith('TRX-')) {
        code = raw.slice(4);
    } else if (raw.startsWith('INV-')) {
        code = raw.slice(4).replace(/-\d{4}\/\d{2}\/\d{2}$/, '');
    }

    return `INV-${code || '00001'}-${stamp}`;
}
