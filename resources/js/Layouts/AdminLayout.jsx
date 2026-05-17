import React from 'react';
import { Link } from '@inertiajs/react';

export default function AdminLayout({ children, user }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside className="glass-panel" style={{ width: '250px', margin: '1rem', display: 'flex', flexDirection: 'column', padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>AC</div>
                    <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-primary-dark)' }}>BengkelAdmin</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <Link href="/admin" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none', background: 'var(--color-primary-alpha)', color: 'var(--color-primary-dark)' }}>Dashboard</Link>
                    <Link href="#" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>Pelanggan</Link>
                    <Link href="#" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>Servis AC</Link>
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
                    <div style={{ fontWeight: 600 }}>{user?.name || 'Administrator'}</div>
                    <div style={{ color: 'var(--color-text-muted)' }}>Admin Panel</div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '1rem 2rem 1rem 0', display: 'flex', flexDirection: 'column' }}>
                <header className="glass-header" style={{ padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Dashboard Overview</h2>
                    <button className="btn btn-primary">Input Servis Baru</button>
                </header>

                <div style={{ flex: 1 }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
