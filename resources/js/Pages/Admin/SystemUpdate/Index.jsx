import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Download, GitBranch, RefreshCw, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';

function shortSha(sha) {
    if (!sha || typeof sha !== 'string') {
        return '—';
    }
    return sha.length > 10 ? `${sha.slice(0, 7)}…` : sha;
}

function updateStatusLabel(status) {
    if (status.fetch_error) {
        return '—';
    }
    if (!status.available || status.remote_sha === null) {
        return '—';
    }
    return status.has_update ? 'Ada update' : 'Tidak ada update';
}

function formatCommitDate(iso) {
    if (!iso) {
        return '';
    }
    try {
        return new Date(iso).toLocaleString('id-ID', {
            dateStyle: 'short',
            timeStyle: 'short',
        });
    } catch {
        return iso;
    }
}

export default function SystemUpdateIndex({ status, config }) {
    const { flash } = usePage().props;
    const deployLogs = flash?.deploy_logs ?? [];
    const [showLogs, setShowLogs] = useState(deployLogs.length > 0);
    const [refreshing, setRefreshing] = useState(false);
    const [discarding, setDiscarding] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        confirm: false,
        run_composer: true,
        run_migrate: true,
        run_npm: true,
        run_optimize: true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (!status?.has_update) {
            return;
        }
        post('/admin/system-update/deploy', { preserveScroll: true });
    };

    const refreshStatus = () => {
        router.get(
            '/admin/system-update',
            { refresh: 1 },
            {
                preserveScroll: true,
                only: ['status', 'config'],
                replace: true,
                onStart: () => setRefreshing(true),
                onFinish: () => setRefreshing(false),
                onError: () => setRefreshing(false),
            },
        );
    };

    const runDiscardChanges = () => {
        if (
            !confirm(
                'PERINGATAN: Ini akan MENGHAPUS SEMUA perubahan lokal di server dan meriset ke HEAD. Lanjutkan?',
            )
        ) {
            return;
        }
        setDiscarding(true);
        router.post('/admin/system-update/discard-changes', {}, {
            preserveScroll: true,
            onFinish: () => setDiscarding(false),
        });
    };

    if (!status?.available) {
        return (
            <AdminLayout title="Update GitHub">
                <Head title="Update GitHub" />
                <div className="glass-panel" style={{ padding: '1.5rem', color: 'var(--color-text-muted)' }}>
                    {status?.message || 'Repository Git tidak ditemukan di server ini.'}
                </div>
            </AdminLayout>
        );
    }

    const repoUrl = status.remote_url?.replace(/\.git$/, '') || status.remote_url;
    const pendingCommits = status.pending_commits ?? [];
    const blockingDirty = status.has_blocking_changes && !status.allow_dirty;
    const canDeploy =
        config.enabled &&
        status.can_deploy &&
        status.has_update &&
        !blockingDirty &&
        !status.fetch_error;

    return (
        <AdminLayout title="Update GitHub">
            <Head title="Update GitHub" />

            <div style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {!config.enabled && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(234, 179, 8, 0.12)',
                        border: '1px solid rgba(234, 179, 8, 0.35)',
                        fontSize: '0.85rem',
                        color: '#ca8a04',
                    }}>
                        Fitur dinonaktifkan. Tambahkan <code style={{ fontFamily: 'monospace' }}>DEPLOY_GITHUB_ENABLED=true</code> di file <code style={{ fontFamily: 'monospace' }}>.env</code> lalu jalankan <code style={{ fontFamily: 'monospace' }}>php artisan config:clear</code>.
                    </div>
                )}

                {(flash?.success || flash?.error) && (
                    <div className="glass-panel" style={{
                        padding: '1rem',
                        fontSize: '0.8rem',
                        whiteSpace: 'pre-wrap',
                        borderRadius: 'var(--radius-md)',
                        background: flash?.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.1)',
                        border: flash?.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                        color: flash?.success ? 'var(--color-success)' : 'var(--color-danger)',
                    }}>
                        {flash?.success || flash?.error}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {/* Status repositori */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <GitBranch size={18} /> Status repositori
                            </h2>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={refreshStatus}
                                disabled={refreshing}
                                style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                                <RefreshCw size={14} style={refreshing ? { animation: 'spin 0.8s linear infinite' } : undefined} />
                                {refreshing ? 'Memperbarui...' : 'Perbarui status'}
                            </button>
                        </div>

                        {repoUrl && (
                            <a href={repoUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem' }}>
                                {status.remote_url} <ExternalLink size={12} />
                            </a>
                        )}

                        <dl style={{ margin: 0, fontSize: '0.875rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
                                <dt style={{ color: 'var(--color-text-muted)' }}>Cabang</dt>
                                <dd style={{ margin: 0, fontFamily: 'monospace', fontWeight: 500 }}>{status.branch}</dd>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                                <dt style={{ color: 'var(--color-text-muted)' }}>Ada update</dt>
                                <dd style={{
                                    margin: 0,
                                    fontWeight: 500,
                                    color: status.has_update && !status.fetch_error
                                        ? 'var(--color-warning)'
                                        : status.fetch_error
                                          ? 'var(--color-text-muted)'
                                          : 'var(--color-success)',
                                }}>
                                    {updateStatusLabel(status)}
                                </dd>
                            </div>
                        </dl>

                        {status.fetch_error && (
                            <p style={{ margin: '1rem 0 0', fontSize: '0.8rem', color: 'var(--color-danger)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                                {status.fetch_error}
                            </p>
                        )}

                        {status.dirty && (
                            <div style={{ marginTop: '1rem' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-danger)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', margin: '0 0 0.5rem' }}>
                                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                                    Ada perubahan pada file yang dilacak di server. Selesaikan dulu sebelum menarik dari GitHub.
                                </p>
                                <ul style={{ maxHeight: 120, overflow: 'auto', margin: '0 0 0.75rem', padding: '0.5rem', fontSize: '0.7rem', fontFamily: 'monospace', listStyle: 'none', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)' }}>
                                    {status.dirty_files?.map((f, i) => (
                                        <li key={i} style={{ color: 'var(--color-danger)' }}>• {f}</li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    disabled={discarding || processing}
                                    onClick={runDiscardChanges}
                                    style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.7rem', textDecoration: 'underline', color: discarding ? 'var(--color-text-muted)' : 'var(--color-danger)', cursor: discarding ? 'not-allowed' : 'pointer' }}
                                >
                                    {discarding ? 'Memproses...' : 'Reset perubahan lokal'}
                                </button>
                            </div>
                        )}

                        {status.ignored_local_changes?.length > 0 && status.allow_dirty && (
                            <p style={{ margin: '1rem 0 0', fontSize: '0.75rem', color: '#ca8a04' }}>
                                File lokal diabaikan (normal setelah build): {status.ignored_local_changes.join(', ')}
                            </p>
                        )}
                    </div>

                    {/* Perbandingan versi */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 1rem' }}>Perbandingan versi</h2>

                        <dl style={{ margin: 0, fontSize: '0.875rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <dt style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Versi terpasang</dt>
                                <dd style={{ margin: '0.25rem 0 0', fontFamily: 'monospace', fontWeight: 600, fontSize: '1rem' }}>
                                    {status.local_version ?? '—'}
                                </dd>
                                <dd style={{ margin: '0.15rem 0 0', fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                                    {shortSha(status.local_sha)}
                                </dd>
                            </div>
                            <div>
                                <dt style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Versi tersedia (origin)</dt>
                                <dd style={{ margin: '0.25rem 0 0', fontFamily: 'monospace', fontWeight: 600, fontSize: '1rem' }}>
                                    {status.remote_version ?? (status.fetch_error ? '—' : '…')}
                                </dd>
                                <dd style={{ margin: '0.15rem 0 0', fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                                    {shortSha(status.remote_sha)}
                                </dd>
                            </div>
                        </dl>

                        {!status.has_release_tags && (
                            <p style={{ margin: '1rem 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                Belum ada tag rilis; buat tag di GitHub untuk nomor versi (mis. 1.0, 1.1).
                            </p>
                        )}

                        {status.has_update && status.commits_behind > 0 && (
                            <p style={{ margin: '1rem 0 0', fontSize: '0.8rem', color: 'var(--color-warning)' }}>
                                {status.commits_behind} commit di belakang origin
                            </p>
                        )}

                        {status.has_update && pendingCommits.length > 0 && (
                            <div style={{ marginTop: '1rem' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: '0 0 0.5rem', color: 'var(--color-text-muted)' }}>
                                    Perubahan yang akan masuk
                                </p>
                                <ul style={{ maxHeight: 180, overflow: 'auto', margin: 0, padding: '0.5rem', listStyle: 'none', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)' }}>
                                    {pendingCommits.map((c) => (
                                        <li key={c.short_sha} style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontFamily: 'monospace', color: 'var(--color-primary-light)' }}>{c.short_sha}</span>
                                            <span> — {c.subject}</span>
                                            {c.date && (
                                                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                                                    {formatCommitDate(c.date)}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {status.compare_url && (
                            <a
                                href={status.compare_url}
                                target="_blank"
                                rel="noreferrer"
                                style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--color-primary)' }}
                            >
                                <ExternalLink size={14} />
                                Bandingkan di GitHub
                            </a>
                        )}
                    </div>
                </div>

                {/* Jalankan update */}
                <form onSubmit={submit} className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Jalankan update</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.55 }}>
                        Akan menarik perubahan dari <strong>origin/{status.branch}</strong> (git pull), lalu menjalankan langkah yang Anda centang di bawah.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        <CheckOption id="run_composer" label="Composer install" checked={data.run_composer} onChange={(v) => setData('run_composer', v)} />
                        <CheckOption id="run_migrate" label="php artisan migrate" checked={data.run_migrate} onChange={(v) => setData('run_migrate', v)} />
                        <CheckOption id="run_npm" label="npm install & build" checked={data.run_npm} onChange={(v) => setData('run_npm', v)} />
                        <CheckOption id="run_optimize" label="Cache optimize (config, route, view)" checked={data.run_optimize} onChange={(v) => setData('run_optimize', v)} />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', marginBottom: '1rem' }}>
                        <input type="checkbox" checked={data.confirm} onChange={(e) => setData('confirm', e.target.checked)} style={{ marginTop: 3 }} />
                        <span>Saya mengerti update akan mengubah file aplikasi di server ini.</span>
                    </label>
                    {errors.confirm && <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>{errors.confirm}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={processing || !canDeploy}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Download size={16} />
                        {processing ? 'Memproses update...' : status.has_update ? 'Update' : 'Sudah versi terbaru'}
                    </button>

                    {!status.has_update && !status.fetch_error && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.75rem 0 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />
                            Kode sudah selaras dengan origin untuk cabang ini.
                        </p>
                    )}
                </form>

                {deployLogs.length > 0 && (
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <button type="button" onClick={() => setShowLogs(!showLogs)} style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', marginBottom: showLogs ? '1rem' : 0 }}>
                            {showLogs ? '▼' : '▶'} Log proses update
                        </button>
                        {showLogs && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {deployLogs.map((log, i) => (
                                    <div key={i} style={{ borderLeft: `3px solid ${log.success ? 'var(--color-success)' : 'var(--color-danger)'}`, paddingLeft: '0.75rem' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            {log.success ? <CheckCircle2 size={14} color="var(--color-success)" /> : <AlertTriangle size={14} color="var(--color-danger)" />}
                                            {log.step}
                                        </div>
                                        {log.output && (
                                            <pre style={{ margin: '0.35rem 0 0', fontSize: '0.7rem', color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 200, overflow: 'auto' }}>{log.output}</pre>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function CheckOption({ id, label, checked, onChange }) {
    return (
        <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            {label}
        </label>
    );
}
