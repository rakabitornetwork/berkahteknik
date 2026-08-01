import React, { useRef } from 'react';

export const VEHICLE_COLOR_PALETTE = [
    { name: 'Putih', hex: '#F5F5F5' },
    { name: 'Hitam', hex: '#1A1A1A' },
    { name: 'Silver', hex: '#C0C0C0' },
    { name: 'Abu-abu', hex: '#6B7280' },
    { name: 'Merah', hex: '#DC2626' },
    { name: 'Biru', hex: '#2563EB' },
    { name: 'Biru Tua', hex: '#1E3A8A' },
    { name: 'Hijau', hex: '#16A34A' },
    { name: 'Kuning', hex: '#EAB308' },
    { name: 'Oranye', hex: '#EA580C' },
    { name: 'Coklat', hex: '#92400E' },
    { name: 'Maroon', hex: '#7F1D1D' },
    { name: 'Ungu', hex: '#7C3AED' },
    { name: 'Emas', hex: '#D4A017' },
    { name: 'Beige', hex: '#D4C4A8' },
    { name: 'Pink', hex: '#EC4899' },
];

export function colorLabel(hex, name) {
    if (name) return name;
    if (!hex) return null;
    const match = VEHICLE_COLOR_PALETTE.find(c => c.hex.toLowerCase() === hex.toLowerCase());
    return match?.name || hex.toUpperCase();
}

export default function ColorPalettePicker({ value, name, onChange, error }) {
    const customInputRef = useRef(null);
    const selectedHex = value || '';
    const selectedName = name || colorLabel(selectedHex) || '';

    const selectColor = (hex, colorName) => {
        onChange({ color: hex, color_name: colorName });
    };

    const clearColor = () => {
        onChange({ color: '', color_name: '' });
    };

    return (
        <div>
            <label className="form-label">Warna Mobil</label>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.75rem',
                padding: '0.65rem 0.75rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.04)',
            }}>
                <div
                    style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '9999px',
                        background: selectedHex || 'transparent',
                        border: '2px solid var(--color-border)',
                        boxShadow: selectedHex ? 'inset 0 0 0 1px rgba(0,0,0,0.08)' : 'none',
                        backgroundImage: selectedHex ? 'none' : 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                        backgroundSize: selectedHex ? undefined : '8px 8px',
                        backgroundPosition: selectedHex ? undefined : '0 0, 0 4px, 4px -4px, -4px 0',
                        flexShrink: 0,
                    }}
                    aria-hidden
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {selectedHex ? selectedName : 'Belum dipilih'}
                    </div>
                    {selectedHex && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                            {selectedHex.toUpperCase()}
                        </div>
                    )}
                </div>
                {selectedHex && (
                    <button
                        type="button"
                        onClick={clearColor}
                        className="btn btn-outline"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    >
                        Hapus
                    </button>
                )}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(2.25rem, 1fr))',
                gap: '0.5rem',
                marginBottom: '0.75rem',
            }}>
                {VEHICLE_COLOR_PALETTE.map(swatch => {
                    const isSelected = selectedHex.toLowerCase() === swatch.hex.toLowerCase();
                    const isLight = ['#F5F5F5', '#C0C0C0', '#EAB308', '#D4C4A8', '#D4A017'].includes(swatch.hex);
                    return (
                        <button
                            key={swatch.hex}
                            type="button"
                            title={swatch.name}
                            onClick={() => selectColor(swatch.hex, swatch.name)}
                            aria-label={swatch.name}
                            aria-pressed={isSelected}
                            style={{
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: '8px',
                                background: swatch.hex,
                                border: isSelected
                                    ? '2.5px solid var(--color-primary)'
                                    : `1px solid ${isLight ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.08)'}`,
                                boxShadow: isSelected ? '0 0 0 2px rgba(15, 118, 110, 0.25)' : 'none',
                                cursor: 'pointer',
                                padding: 0,
                                position: 'relative',
                            }}
                        >
                            {isSelected && (
                                <span style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isLight ? '#111' : '#fff',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                }}>
                                    ✓
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                    ref={customInputRef}
                    type="color"
                    value={selectedHex && /^#[0-9A-Fa-f]{6}$/.test(selectedHex) ? selectedHex : '#808080'}
                    onChange={e => selectColor(e.target.value.toUpperCase(), 'Kustom')}
                    style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        padding: 0,
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: 'transparent',
                    }}
                    title="Pilih warna kustom"
                />
                <button
                    type="button"
                    onClick={() => customInputRef.current?.click()}
                    className="btn btn-outline"
                    style={{ fontSize: '0.8rem' }}
                >
                    Pilih warna kustom
                </button>
            </div>

            {error && (
                <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    {error}
                </div>
            )}
        </div>
    );
}
