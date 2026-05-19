import React from 'react';
import { router } from '@inertiajs/react';

/** Terjemahkan label pagination Laravel ke Bahasa Indonesia */
export function formatPaginationLabel(label) {
    const text = String(label).replace(/<[^>]*>/g, '').trim();

    if (text.includes('pagination.previous') || /^previous$/i.test(text) || text === '«') {
        return '« Sebelumnya';
    }
    if (text.includes('pagination.next') || /^next$/i.test(text) || text === '»') {
        return 'Berikutnya »';
    }
    if (text === '...' || text === '…') {
        return '…';
    }

    return text
        .replace(/pagination\.previous/gi, 'Sebelumnya')
        .replace(/pagination\.next/gi, 'Berikutnya');
}

export default function Pagination({ links, query = {}, className = '' }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav className={`pagination-nav ${className}`.trim()} aria-label="Navigasi halaman">
            {links.map((link, i) => (
                <button
                    key={i}
                    type="button"
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url, query, { preserveState: true })}
                    className={`pagination-btn${link.active ? ' is-active' : ''}${!link.url ? ' is-disabled' : ''}`}
                >
                    {formatPaginationLabel(link.label)}
                </button>
            ))}
        </nav>
    );
}
