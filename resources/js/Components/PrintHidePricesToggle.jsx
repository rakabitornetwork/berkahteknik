import React from 'react';

export default function PrintHidePricesToggle({ checked, onChange, label = 'Sembunyikan harga & subtotal' }) {
    return (
        <label className="print-hide-prices-toggle">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            {label}
        </label>
    );
}
