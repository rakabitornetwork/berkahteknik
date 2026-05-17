import React from 'react';

export default function MetricCard({ title, value, icon, trend, accentColor = 'var(--color-primary)' }) {
    return (
        <div className="glass-panel hover-lift" style={{ 
            padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', 
            borderTop: `2px solid ${accentColor}`,
            borderTopLeftRadius: 'var(--radius-sm)',
            borderTopRightRadius: 'var(--radius-sm)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', margin: 0 }}>{title}</h3>
                {icon && <span style={{ color: 'var(--color-text-muted)', display: 'flex' }}>{icon}</span>}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1 }}>
                {value}
            </div>
            {trend && (
                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                    {trend}
                </div>
            )}
        </div>
    );
}
