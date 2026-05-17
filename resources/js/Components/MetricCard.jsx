import React from 'react';

export default function MetricCard({ title, value, icon, trend }) {
    return (
        <div className="glass-panel hover-lift" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>{title}</h3>
                {icon && <span style={{ color: 'var(--color-primary-light)' }}>{icon}</span>}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                {value}
            </div>
            {trend && (
                <div style={{ fontSize: '0.75rem', color: trend.startsWith('+') ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                    {trend}
                </div>
            )}
        </div>
    );
}
