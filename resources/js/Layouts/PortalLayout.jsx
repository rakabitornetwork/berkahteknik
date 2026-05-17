import React from 'react';
import { Link } from '@inertiajs/react';

export default function PortalLayout({ children, user }) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <div className="hd-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>AC</div>
                        <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>Bengkel AC Berkah</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link href="/" className="btn" style={{ fontWeight: 600 }}>Beranda</Link>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontWeight: 500 }}>{user.name}</span>
                                <Link href="/portal/logout" method="post" as="button" className="btn btn-outline" style={{ padding: '0.25rem 0.75rem' }}>Logout</Link>
                            </div>
                        ) : (
                            <Link href="/portal/login" className="btn btn-primary">Login Pelanggan</Link>
                        )}
                    </div>
                </div>
            </nav>

            <main style={{ flex: 1, padding: '2rem 0' }}>
                <div className="hd-container">
                    {children}
                </div>
            </main>
            
            <footer style={{ borderTop: '1px solid var(--color-border)', padding: '2rem 0', marginTop: 'auto', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <div className="hd-container">
                    &copy; {new Date().getFullYear()} Bengkel AC Berkah Teknik. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
