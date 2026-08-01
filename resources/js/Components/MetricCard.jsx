import React from 'react';

export default function MetricCard({
    title,
    value,
    icon,
    trend,
    accentColor = 'var(--color-primary)',
    gradient,
}) {
    const isFilled = Boolean(gradient);

    return (
        <div
            className="hover-lift metric-card"
            style={{
                padding: '1.35rem 1.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                borderRadius: 'var(--radius-lg)',
                position: 'relative',
                overflow: 'hidden',
                border: isFilled ? '1px solid transparent' : '1px solid var(--color-glass-border)',
                background: isFilled ? gradient : 'var(--color-surface)',
                boxShadow: isFilled
                    ? '0 10px 28px rgba(15, 23, 42, 0.18)'
                    : 'var(--shadow-sm)',
                borderTop: isFilled ? undefined : `3px solid ${accentColor}`,
                color: isFilled ? '#fff' : 'inherit',
            }}
        >
            {isFilled && (
                <>
                    <span
                        aria-hidden
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background:
                                'linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 42%, transparent 68%)',
                            pointerEvents: 'none',
                        }}
                    />
                    <span
                        aria-hidden
                        style={{
                            position: 'absolute',
                            width: '7.5rem',
                            height: '7.5rem',
                            right: '-1.5rem',
                            bottom: '-2rem',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            pointerEvents: 'none',
                        }}
                    />
                </>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
                <h3
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        color: isFilled ? 'rgba(255,255,255,0.86)' : 'var(--color-text-muted)',
                        margin: 0,
                    }}
                >
                    {title}
                </h3>
                {icon && (
                    <span
                        style={{
                            color: isFilled ? '#fff' : accentColor,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '2.35rem',
                            height: '2.35rem',
                            borderRadius: '0.75rem',
                            background: isFilled ? 'rgba(255,255,255,0.18)' : 'var(--color-primary-alpha)',
                            backdropFilter: isFilled ? 'blur(6px)' : undefined,
                            boxShadow: isFilled ? 'inset 0 1px 0 rgba(255,255,255,0.25)' : undefined,
                            flexShrink: 0,
                        }}
                    >
                        {icon}
                    </span>
                )}
            </div>
            <div
                style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.55rem',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: isFilled ? '#fff' : 'var(--color-text-main)',
                    lineHeight: 1.15,
                    position: 'relative',
                }}
            >
                {value}
            </div>
            {trend && (
                <div
                    style={{
                        fontSize: '0.82rem',
                        color: isFilled ? 'rgba(255,255,255,0.78)' : 'var(--color-text-muted)',
                        lineHeight: 1.4,
                        position: 'relative',
                    }}
                >
                    {trend}
                </div>
            )}
        </div>
    );
}
