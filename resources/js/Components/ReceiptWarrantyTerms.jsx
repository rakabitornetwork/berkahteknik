import React from 'react';
import { warrantyText } from '../lib/warrantyText';

export default function ReceiptWarrantyTerms({ shop }) {
    const months = Number(shop?.warranty_default_months || 0);
    const policy = warrantyText(shop);

    return (
        <div className="receipt-warranty">
            <div className="receipt-warranty-title">Ketentuan Garansi</div>
            {months > 0 && (
                <div className="receipt-warranty-meta">
                    Masa garansi: {months} bulan sejak tanggal pembelian.
                </div>
            )}
            <div className="receipt-warranty-body">{policy}</div>
        </div>
    );
}
