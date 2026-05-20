import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { applyTheme, getStoredTheme, toggleTheme } from '../hooks/useTheme';

export default function ThemeToggle({ className = '' }) {
    const [theme, setThemeState] = useState('dark');

    useEffect(() => {
        const stored = getStoredTheme();
        setThemeState(stored);
        applyTheme(stored);
    }, []);

    const handleToggle = () => {
        const next = toggleTheme(theme);
        setThemeState(next);
    };

    const isLight = theme === 'light';

    return (
        <button
            type="button"
            onClick={handleToggle}
            className={`theme-toggle-btn ${className}`.trim()}
            title={isLight ? 'Aktifkan mode gelap' : 'Aktifkan mode cerah'}
            aria-label={isLight ? 'Aktifkan mode gelap' : 'Aktifkan mode cerah'}
        >
            <span className="theme-icon-wrap">
                <Sun
                    className="theme-icon"
                    size={18}
                    style={{
                        opacity: isLight ? 1 : 0,
                        transform: isLight ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
                    }}
                />
                <Moon
                    className="theme-icon"
                    size={18}
                    style={{
                        opacity: isLight ? 0 : 1,
                        transform: isLight ? 'rotate(-90deg) scale(0)' : 'rotate(0deg) scale(1)',
                    }}
                />
            </span>
        </button>
    );
}
