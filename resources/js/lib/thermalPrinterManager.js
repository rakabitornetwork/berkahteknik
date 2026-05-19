import WebBluetoothReceiptPrinter from '@point-of-sale/webbluetooth-receipt-printer';
import { loadThermalDevice, saveThermalDevice } from './thermalPrinterStorage';

class ThermalPrinterManager {
    constructor() {
        this.printer = new WebBluetoothReceiptPrinter();
        this.device = null;
        this.listeners = new Set();
        this._connectPromise = null;

        this.printer.addEventListener('connected', (device) => {
            this.device = device;
            saveThermalDevice(device);
            this._notify();
        });

        this.printer.addEventListener('disconnected', () => {
            this.device = null;
            this._notify();
        });
    }

    _notify() {
        const state = this.getState();
        this.listeners.forEach((fn) => fn(state));
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    isSupported() {
        return typeof navigator !== 'undefined' && !!navigator.bluetooth;
    }

    getState() {
        const saved = loadThermalDevice();
        return {
            supported: this.isSupported(),
            connected: !!this.device,
            deviceName: this.device?.name ?? saved?.name ?? null,
            savedDevice: saved,
        };
    }

    _waitForConnected(timeoutMs = 15000) {
        if (this.device) {
            return Promise.resolve(this.device);
        }

        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                clearInterval(poll);
                reject(new Error('Koneksi printer timeout. Pastikan printer menyala dan dalam jangkauan.'));
            }, timeoutMs);

            const done = (device) => {
                clearTimeout(timer);
                clearInterval(poll);
                resolve(device);
            };

            const poll = setInterval(() => {
                if (this.device) {
                    done(this.device);
                }
            }, 80);

            this.printer.addEventListener('connected', done);
        });
    }

    async connect() {
        if (!this.isSupported()) {
            throw new Error(
                'Browser tidak mendukung Web Bluetooth. Gunakan Chrome atau Edge di HTTPS / localhost, dan aktifkan Bluetooth.',
            );
        }

        if (this._connectPromise) {
            return this._connectPromise;
        }

        this._connectPromise = (async () => {
            await this.printer.connect();
            return this._waitForConnected();
        })();

        try {
            return await this._connectPromise;
        } finally {
            this._connectPromise = null;
        }
    }

    async reconnectSaved() {
        if (!this.isSupported()) return false;

        const saved = loadThermalDevice();
        if (!saved?.id || !navigator.bluetooth?.getDevices) {
            return false;
        }

        try {
            await this.printer.reconnect(saved);
            await this._waitForConnected(5000);
            return !!this.device;
        } catch {
            return false;
        }
    }

    async ensureConnected() {
        if (this.device) {
            return this.device;
        }

        const reconnected = await this.reconnectSaved();
        if (reconnected && this.device) {
            return this.device;
        }

        return this.connect();
    }

    async print(data) {
        await this.ensureConnected();
        await this.printer.print(data);
    }

    async disconnect() {
        await this.printer.disconnect();
        this.device = null;
        this._notify();
    }
}

export const thermalPrinterManager = new ThermalPrinterManager();
