import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

let nextId = 1;
let items = [];
const listeners = new Set();
let bound = false;
let lastToastKey = '';
let lastToastAt = 0;

function emit() {
    listeners.forEach((fn) => fn(items));
}

function dismiss(id) {
    items = items.filter((item) => item.id !== id);
    emit();
}

function push(type, message) {
    const text = String(message || '').trim();
    if (!text) return;

    const now = Date.now();
    const key = `${type}:${text}`;
    if (key === lastToastKey && now - lastToastAt < 900) return;
    lastToastKey = key;
    lastToastAt = now;

    const id = nextId++;
    items = [...items, { id, type, message: text }];
    emit();

    window.setTimeout(() => dismiss(id), type === 'error' ? 6500 : 4200);
}

export const toast = {
    success: (message) => push('success', message),
    error: (message) => push('error', message),
};

function resolveErrorBag(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
    if (payload.errors && typeof payload.errors === 'object' && !Array.isArray(payload.errors)) {
        return payload.errors;
    }
    return payload;
}

export function toastFromErrors(errors, fallback = 'Perintah gagal dijalankan. Periksa data yang diisi.') {
    const bag = resolveErrorBag(errors) || {};
    const first = Object.values(bag)[0];
    const message = Array.isArray(first) ? first[0] : first;
    toast.error(typeof message === 'string' && message ? message : fallback);
}

function bindToastListeners() {
    if (bound) return;
    bound = true;

    router.on('success', (event) => {
        const flash = event.detail?.page?.props?.flash;
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    });

    router.on('error', (event) => {
        toastFromErrors(event?.detail?.errors ?? event?.detail ?? event);
    });

    router.on('exception', () => {
        toast.error('Terjadi kesalahan. Perintah gagal dijalankan.');
    });
}

export default function ToastViewport() {
    const [toasts, setToasts] = useState(items);

    useEffect(() => {
        bindToastListeners();
        listeners.add(setToasts);
        return () => listeners.delete(setToasts);
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="toast-host" aria-live="polite" aria-relevant="additions">
            {toasts.map((item) => {
                const isError = item.type === 'error';
                const Icon = isError ? XCircle : CheckCircle2;

                return (
                    <div key={item.id} className={`toast-item ${isError ? 'toast-error' : 'toast-success'}`} role="status">
                        <Icon size={18} strokeWidth={2.25} className="toast-icon" />
                        <div className="toast-message">{item.message}</div>
                        <button type="button" className="toast-close" onClick={() => dismiss(item.id)} aria-label="Tutup notifikasi">
                            <X size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
