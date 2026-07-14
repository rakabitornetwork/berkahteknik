import WebBluetoothReceiptPrinter from '@point-of-sale/webbluetooth-receipt-printer';
import { loadThermalDevice, saveThermalDevice } from './thermalPrinterStorage';

class ThermalPrinterManager {
    constructor() {
        this.printer = null;
        this.device = null;
        this.listeners = new Set();
        this._connectPromise = null;
    }

    _ensurePrinter() {
        if (this.printer) {
            return this.printer;
        }

        if (!this.isSupported()) {
            throw new Error(
                'Browser tidak mendukung Web Bluetooth. Gunakan Chrome atau Edge di HTTPS / localhost, dan aktifkan Bluetooth.',
            );
        }

        this.printer = new WebBluetoothReceiptPrinter();

        this.printer.addEventListener('connected', (device) => {
            this.device = device;
            saveThermalDevice(device);
            this._notify();
        });

        this.printer.addEventListener('disconnected', () => {
            this.device = null;
            this._notify();
        });

        return this.printer;
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

        const printer = this._ensurePrinter();

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

            printer.addEventListener('connected', done);
        });
    }

    async connect() {
        const printer = this._ensurePrinter();

        if (this._connectPromise) {
            return this._connectPromise;
        }

        this._connectPromise = (async () => {
            await printer.connect();
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
            const printer = this._ensurePrinter();
            await printer.reconnect(saved);
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
        await this._ensurePrinter().print(data);
    }

    async disconnect() {
        if (!this.printer) {
            this.device = null;
            this._notify();
            return;
        }

        await this.printer.disconnect();
        this.device = null;
        this._notify();
    }
}

export const thermalPrinterManager = new ThermalPrinterManager();
