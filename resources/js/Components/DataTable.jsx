import React from 'react';

export default function DataTable({ columns, data }) {
    return (
        <div className="table-responsive">
            <table className="hd-table">
                <thead>
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx}>{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>
                                        {col.cell ? col.cell(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                                Tidak ada data.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
