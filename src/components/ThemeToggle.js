'use client';

import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
            <span className="theme-icon">
                {theme === 'dark' ? '☀️' : '🌙'}
            </span>

            <style jsx>{`
                .theme-toggle {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .theme-toggle:hover {
                    background: var(--bg-hover);
                    transform: rotate(15deg);
                }

                .theme-icon {
                    font-size: 1.25rem;
                    transition: transform 0.3s ease;
                }

                .theme-toggle:active .theme-icon {
                    transform: scale(0.9);
                }
            `}</style>
        </button>
    );
}
