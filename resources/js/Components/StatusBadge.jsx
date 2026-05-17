import React from 'react';

export default function StatusBadge({ status }) {
    let colorClass = '';
    let pulseClass = '';

    switch (status.toLowerCase()) {
        case 'antri':
            colorClass = 'text-amber-500';
            break;
        case 'dikerjakan':
            colorClass = 'text-blue-500';
            pulseClass = 'active';
            break;
        case 'selesai':
            colorClass = 'text-emerald-500';
            break;
        default:
            colorClass = 'text-slate-500';
    }

    return (
        <span style={{ color: `var(--color-${colorClass.includes('amber') ? 'warning' : colorClass.includes('blue') ? 'info' : colorClass.includes('emerald') ? 'success' : 'text-muted'})` }} className={`status-pulse ${pulseClass} capitalize font-medium ml-4`}>
            {status}
        </span>
    );
}
