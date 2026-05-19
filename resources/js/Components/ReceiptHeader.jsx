import React from 'react';

export function PaidWatermark() {
    return (
        <div
            aria-hidden
            className="receipt-paid-watermark"
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 10,
                overflow: 'hidden',
            }}
        >
            <span
                style={{
                    transform: 'rotate(-28deg)',
                    fontSize: 'clamp(2.5rem, 14vw, 4.5rem)',
                    fontWeight: 800,
                    letterSpacing: '0.18em',
                    color: 'rgba(22, 163, 74, 0.18)',
                    border: '3px solid rgba(22, 163, 74, 0.3)',
                    borderRadius: '10px',
                    padding: '0.12em 0.4em',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                }}
            >
                LUNAS
            </span>
        </div>
    );
}

export default function ReceiptHeader({
    shop,
    dark = false,
    customerName,
    receiptNumber,
    transactionDate,
}) {
    const muted = dark ? '#64748b' : 'var(--color-text-muted)';
    const main = dark ? '#0f172a' : 'var(--color-text-main)';
    const border = dark ? '#e2e8f0' : 'var(--color-border)';

    const dateLabel = transactionDate
        ? new Date(transactionDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

    const contactParts = [shop?.phone && `Telp ${shop.phone}`, shop?.whatsapp && `WA ${shop.whatsapp}`, shop?.email].filter(Boolean);

    return (
        <header
            className="receipt-header"
            style={{
                marginBottom: '0.85rem',
                paddingBottom: '0.75rem',
                borderBottom: `1px solid ${border}`,
            }}
        >
            <div
                className="receipt-header-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 0.85fr)',
                    gap: '0.75rem 2rem',
                    alignItems: 'start',
                }}
            >
                <ShopColumn shop={shop} main={main} muted={muted} contactParts={contactParts} />
                <TxnColumn
                    muted={muted}
                    main={main}
                    receiptNumber={receiptNumber}
                    dateLabel={dateLabel}
                    customerName={customerName}
                />
            </div>
        </header>
    );
}

function ShopColumn({ shop, main, muted, contactParts }) {
    return (
        <div className="receipt-header-shop">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                {shop?.logo_url && (
                    <img
                        src={shop.logo_url}
                        alt={shop.legal_name}
                        style={{ maxHeight: 40, maxWidth: 40, objectFit: 'contain', flexShrink: 0 }}
                    />
                )}
                <div style={{ minWidth: 0 }}>
                    <h1 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: main, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                        {shop?.legal_name || shop?.app_name}
                    </h1>
                    {shop?.tagline && (
                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.7rem', color: muted, lineHeight: 1.35 }}>{shop.tagline}</p>
                    )}
                </div>
            </div>
            {shop?.address && (
                <p style={{ margin: '0.4rem 0 0', fontSize: '0.68rem', color: muted, lineHeight: 1.4 }}>{shop.address}</p>
            )}
            {contactParts.length > 0 && (
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.65rem', color: muted, lineHeight: 1.4 }}>
                    {contactParts.join(' · ')}
                </p>
            )}
        </div>
    );
}

function MetaRow({ label, value, main, muted, emphasize = false }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'baseline' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>
                {label}
            </span>
            <span
                style={{
                    fontSize: emphasize ? '0.8rem' : '0.72rem',
                    fontWeight: emphasize ? 700 : 600,
                    color: main,
                    textAlign: 'right',
                    fontFamily: label === 'No. Nota' ? 'ui-monospace, monospace' : 'inherit',
                }}
            >
                {value}
            </span>
        </div>
    );
}

function TxnColumn({ muted, main, receiptNumber, dateLabel, customerName }) {
    return (
        <div className="receipt-header-txn" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {receiptNumber && <MetaRow label="No. Nota" value={receiptNumber} main={main} muted={muted} />}
            {dateLabel && <MetaRow label="Tanggal" value={dateLabel} main={main} muted={muted} />}
            <MetaRow label="Pelanggan" value={customerName || 'Pelanggan Umum'} main={main} muted={muted} emphasize />
        </div>
    );
}
