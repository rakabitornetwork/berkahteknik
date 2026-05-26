import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

const resolveUrl = (template, row) => template.replace('{id}', row.id);

function DynamicForm({ form }) {
    const initial = Object.fromEntries((form.fields || []).map(field => [field.name, field.default || '']));
    const [data, setData] = useState(initial);

    const submit = (e) => {
        e.preventDefault();
        const method = form.method || 'post';
        router[method](form.action, data, { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="glass-panel" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{form.title}</h3>
            {(form.fields || []).map(field => (
                <label key={field.name} style={{ display: 'grid', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {field.label}
                    {field.type === 'textarea' ? (
                        <textarea
                            className="form-input"
                            value={data[field.name] || ''}
                            onChange={e => setData(prev => ({ ...prev, [field.name]: e.target.value }))}
                            required={field.required}
                            rows={3}
                        />
                    ) : field.type === 'select' ? (
                        <select
                            className="form-input"
                            value={data[field.name] || ''}
                            onChange={e => setData(prev => ({ ...prev, [field.name]: e.target.value }))}
                            required={field.required}
                        >
                            <option value="">Pilih...</option>
                            {Object.entries(field.options || {}).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            className="form-input"
                            type={field.type || 'text'}
                            value={data[field.name] || ''}
                            onChange={e => setData(prev => ({ ...prev, [field.name]: e.target.value }))}
                            required={field.required}
                        />
                    )}
                </label>
            ))}
            <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>
                Simpan
            </button>
        </form>
    );
}

export default function OperationsIndex({ title, description, columns = [], rows, actions = [], forms = [], stats = [], extras = {} }) {
    const data = rows?.data || rows || [];

    const handleAction = (action, row) => {
        if (action.confirm && !window.confirm(action.confirm)) return;
        const method = action.method || 'post';
        router[method](resolveUrl(action.url, row), action.payload || {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title={title}>
            <Head title={title} />

            <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>{title}</h2>
                    <p style={{ margin: '0.35rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{description}</p>
                </div>

                {stats.length > 0 && (
                    <div className="hd-grid hd-grid-cols-4">
                        {stats.map(stat => (
                            <div key={stat.label} className="glass-panel" style={{ padding: '1rem' }}>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</div>
                                <div style={{ marginTop: '0.35rem', fontSize: '1.2rem', fontWeight: 800 }}>{stat.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {extras.exports?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {extras.exports.map(link => (
                            <a key={link.href} href={link.href} className="btn btn-outline">{link.label}</a>
                        ))}
                    </div>
                )}

                {forms.length > 0 && (
                    <div className="hd-grid hd-grid-cols-2">
                        {forms.map(form => <DynamicForm key={form.title} form={form} />)}
                    </div>
                )}

                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                    <div className="table-responsive">
                        <table className="hd-table">
                            <thead>
                                <tr>
                                    {columns.map(column => <th key={column.key}>{column.label}</th>)}
                                    {actions.length > 0 && <th style={{ textAlign: 'center' }}>Aksi</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 ? data.map((row, rowIndex) => (
                                    <tr key={row.id || rowIndex}>
                                        {columns.map(column => <td key={column.key}>{row[column.key]}</td>)}
                                        {actions.length > 0 && (
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                                    {actions.map(action => (
                                                        <button
                                                            key={action.label}
                                                            type="button"
                                                            className="btn btn-outline"
                                                            onClick={() => handleAction(action, row)}
                                                            style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem' }}
                                                        >
                                                            {action.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                                            Belum ada data.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {rows?.links && <Pagination links={rows.links} />}
            </div>
        </AdminLayout>
    );
}
