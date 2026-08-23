const STORAGE_KEY = 'berkahteknik_hide_print_prices';

export function readHidePrintPrices() {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
        return false;
    }
}

export function writeHidePrintPrices(hidden) {
    try {
        window.localStorage.setItem(STORAGE_KEY, hidden ? '1' : '0');
    } catch {
        /* ignore */
    }
}
