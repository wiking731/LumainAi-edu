'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AppLauncher from './AppLauncher';

const translations = {
    uz: {
        home: "Bosh sahifa",
        chat: "AI Chat",
        marketplace: "Yuristlar",
        partners: "Hamkorlar",
        login: "Kirish",
    },
    ru: {
        home: "Главная",
        chat: "AI Чат",
        marketplace: "Юристы",
        partners: "Партнёры",
        login: "Войти",
    }
};

export default function Navbar({ lang = 'uz' }) {
    const router = useRouter();
    const pathname = usePathname();
    const t = translations[lang];
    const [showLauncher, setShowLauncher] = useState(false);

    const navLinks = [
        { href: '/', label: t.home },
        { href: '/marketplace', label: t.marketplace },
    ];

    const isActive = (href) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <div className="navbar-logo" onClick={() => router.push('/')}>
                    <div className="navbar-logo-icon">⚖️</div>
                    <span className="navbar-logo-text">AdvoAI</span>
                </div>

                {/* Nav Links */}
                <div className="navbar-links">
                    {navLinks.map((link) => (
                        <button
                            key={link.href}
                            className={`navbar-link ${isActive(link.href) ? 'active' : ''}`}
                            onClick={() => router.push(link.href)}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                {/* Right Section */}
                <div className="navbar-right">
                    {/* Language Switcher */}
                    <div className="navbar-lang">
                        <button
                            className={`lang-btn-sm ${lang === 'uz' ? 'active' : ''}`}
                            onClick={() => {
                                const url = new URL(window.location.href);
                                url.searchParams.set('lang', 'uz');
                                router.push(url.pathname + url.search);
                            }}
                        >
                            UZ
                        </button>
                        <button
                            className={`lang-btn-sm ${lang === 'ru' ? 'active' : ''}`}
                            onClick={() => {
                                const url = new URL(window.location.href);
                                url.searchParams.set('lang', 'ru');
                                router.push(url.pathname + url.search);
                            }}
                        >
                            RU
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => router.push('/partners/register')}
                    >
                        {t.login}
                    </button>

                    {/* App Launcher (9-dot) */}
                    <div className="app-launcher-wrapper">
                        <button
                            className="app-launcher-trigger"
                            onClick={() => setShowLauncher(!showLauncher)}
                            aria-label="Apps"
                        >
                            <div className="dots-grid">
                                <span></span><span></span><span></span>
                                <span></span><span></span><span></span>
                                <span></span><span></span><span></span>
                            </div>
                        </button>
                        {showLauncher && (
                            <AppLauncher
                                lang={lang}
                                onClose={() => setShowLauncher(false)}
                            />
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 64px;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid var(--border-color);
                    z-index: 1000;
                }

                .navbar-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 1.5rem;
                    position: relative;
                }

                .navbar-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    transition: opacity 0.2s;
                    z-index: 1;
                }

                .navbar-logo:hover {
                    opacity: 0.8;
                }

                .navbar-logo-icon {
                    width: 40px;
                    height: 40px;
                    background: var(--accent-gradient);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                }

                .navbar-logo-text {
                    font-size: 1.5rem;
                    font-weight: 800;
                    background: var(--accent-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .navbar-links {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .navbar-link {
                    padding: 0.5rem 1rem;
                    font-size: 0.9375rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    background: transparent;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .navbar-link:hover {
                    color: var(--text-primary);
                    background: var(--bg-hover);
                }

                .navbar-link.active {
                    color: var(--accent-primary);
                    background: var(--accent-gradient-soft);
                }

                .navbar-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .navbar-lang {
                    display: flex;
                    gap: 0.25rem;
                    background: var(--bg-tertiary);
                    padding: 0.25rem;
                    border-radius: 8px;
                }

                .lang-btn-sm {
                    padding: 0.375rem 0.625rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    background: transparent;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .lang-btn-sm:hover {
                    color: var(--text-primary);
                }

                .lang-btn-sm.active {
                    color: white;
                    background: var(--accent-primary);
                }

                .app-launcher-wrapper {
                    position: relative;
                }

                .app-launcher-trigger {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .app-launcher-trigger:hover {
                    background: var(--bg-hover);
                }

                .dots-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 3px;
                }

                .dots-grid span {
                    width: 4px;
                    height: 4px;
                    background: var(--text-secondary);
                    border-radius: 50%;
                }

                @media (max-width: 768px) {
                    .navbar-links {
                        display: none;
                    }
                }
            `}</style>
        </nav>
    );
}
