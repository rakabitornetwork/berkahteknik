const DEVICE_KEY = 'berkahteknik_thermal_device';
const PAPER_KEY = 'berkahteknik_thermal_paper';

export function loadThermalDevice() {
    try {
        const raw = localStorage.getItem(DEVICE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function saveThermalDevice(device) {
    if (!device?.id) return;
    localStorage.setItem(DEVICE_KEY, JSON.stringify({
        id: device.id,
        name: device.name,
        language: device.language,
        codepageMapping: device.codepageMapping,
    }));
}

export function clearThermalDevice() {
    localStorage.removeItem(DEVICE_KEY);
}

export function getPaperWidth() {
    const v = localStorage.getItem(PAPER_KEY);
    return v === '58' ? 58 : 80;
}

export function setPaperWidth(mm) {
    localStorage.setItem(PAPER_KEY, mm === 58 ? '58' : '80');
}

export function getPaperColumns(mm = getPaperWidth()) {
    return mm === 58 ? 32 : 48;
}
