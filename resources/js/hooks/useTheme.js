const STORAGE_KEY = 'berkahteknik_theme';

export function getStoredTheme() {
    if (typeof window === 'undefined') {
        return 'dark';
    }

    const stored = localStorage.getItem(STORAGE_KEY);

    return stored === 'light' ? 'light' : 'dark';
}

export function applyTheme(theme) {
    const root = document.documentElement;
    const next = theme === 'light' ? 'light' : 'dark';

    root.classList.remove('light', 'dark');
    root.classList.add(next);
    root.style.colorScheme = next;
}

export function setTheme(theme) {
    const next = theme === 'light' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);

    return next;
}

export function toggleTheme(currentTheme) {
    const next = currentTheme === 'dark' ? 'light' : 'dark';

    return setTheme(next);
}
