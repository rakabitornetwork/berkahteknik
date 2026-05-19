import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Download, GitBranch, RefreshCw, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';

export default function SystemUpdateIndex({ status, config }) {
    const { flash } = usePage().props;
    const deployLogs = flash?.deploy_logs ?? [];
    const [showLogs, setShowLogs] = useState(deployLogs.length > 0);
    const [refreshing, setRefreshing] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        confirm: false,
        run_composer: true,
        run_migrate: true,
        run_npm: true,
        run_optimize: true,
    });

    const submit = (e) => {
        e.preventDefault();
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

    const targetTag = config.tag || status.target_tag || '1.1';
    const needsUpdate = status.needs_update;
    const repoUrl = status.remote_url?.replace(/\.git$/, '') || 'https://github.com/rakabitornetwork/berkahteknik';

    return (
        <AdminLayout title="Update GitHub">
            <Head title="Update GitHub" />

            <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <GitBranch size={18} /> Status Repository
                            </h2>
                            <a href={repoUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                {status.remote_url} <ExternalLink size={12} />
                            </a>
                        </div>
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

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Stat label="Versi saat ini" value={status.current_tag ? `v${status.current_tag.replace(/^v/, '')}` : status.current_version} highlight={!status.is_on_target_version} />
                        <Stat label="Versi target" value={`v${targetTag.replace(/^v/, '')}`} />
                        {!status.target_tag_exists && (
                            <Stat label="Tag di GitHub" value="Belum ada" highlight />
                        )}
                    </div>

                    {status.last_commit_message && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 1rem', lineHeight: 1.5 }}>
                            <strong>Terakhir:</strong> {status.last_commit_message}
                            {status.last_commit_date && <span style={{ opacity: 0.8 }}> ({status.last_commit_date})</span>}
                        </p>
                    )}

                    {status.has_local_changes && !status.can_deploy && (
                        <div style={{
                            display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.75rem', marginBottom: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--color-danger)',
                        }}>
                            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span>
                                Deploy diblokir: ada perubahan file penting yang belum di-commit.
                                {status.local_changes?.length > 0 && (
                                    <> File: <code style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{status.local_changes.join(', ')}</code>.</>
                                )}
                                {' '}Atau tambahkan <code style={{ fontFamily: 'monospace' }}>DEPLOY_ALLOW_DIRTY=true</code> di .env lalu <code style={{ fontFamily: 'monospace' }}>php artisan config:clear</code>.
                            </span>
                        </div>
                    )}

                    {status.ignored_local_changes?.length > 0 && status.can_deploy && (
                        <div style={{
                            display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.75rem', marginBottom: '1rem',
                            background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.35)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: '#ca8a04',
                        }}>
                            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span>
                                File lokal di server (normal setelah build): <code style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{status.ignored_local_changes.join(', ')}</code>.
                                {status.allow_dirty ? ' Deploy diizinkan.' : ' Tidak menghalangi deploy.'}
                            </span>
                        </div>
                    )}

                    {!status.target_tag_exists && (
                        <div style={{
                            display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.75rem', marginBottom: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--color-danger)',
                        }}>
                            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span>
                                Tag <strong>v{targetTag.replace(/^v/, '')}</strong> belum ada di GitHub.
                                Buat: <code style={{ fontFamily: 'monospace' }}>git tag {targetTag}</code> lalu <code style={{ fontFamily: 'monospace' }}>git push origin {targetTag}</code>
                            </span>
                        </div>
                    )}

                    {needsUpdate && status.target_tag_exists && !status.has_local_changes && (
                        <div style={{
                            display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem', marginBottom: '1rem',
                            background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--color-primary-light)',
                        }}>
                            <Download size={16} />
                            Versi <strong>v{targetTag.replace(/^v/, '')}</strong> tersedia di GitHub — siap dipasang.
                        </div>
                    )}

                    {status.is_on_target_version && (
                        <div style={{
                            display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem', marginBottom: '1rem',
                            background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--color-success)',
                        }}>
                            <CheckCircle2 size={16} />
                            Server sudah pada versi <strong>v{targetTag.replace(/^v/, '')}</strong>.
                        </div>
                    )}
                </div>

                <form onSubmit={submit} className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Jalankan update</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.55 }}>
                        Akan checkout ke tag versi <strong>v{targetTag.replace(/^v/, '')}</strong> dari GitHub, lalu menjalankan langkah yang Anda centang di bawah.
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
                        disabled={processing || !config.enabled || !status.can_deploy}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Download size={16} />
                        {processing ? 'Memproses update...' : `Pasang versi v${targetTag.replace(/^v/, '')}`}
                    </button>
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

function Stat({ label, value, highlight }) {
    return (
        <div style={{ padding: '0.65rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: highlight ? 'var(--color-warning)' : 'var(--color-text-main)', marginTop: '0.15rem' }}>{value}</div>
        </div>
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
