'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const translations = {
    uz: {
        title: "Xizmatlar",
        apps: [
            { id: 'chat', icon: '🤖', label: 'AI Chat', href: '/', description: 'Huquqiy maslahat' },
            { id: 'imtiyoz', icon: '💰', label: 'Imtiyozlar', href: '/?mode=imtiyoz', description: 'Subsidiyalar (T-3)' },
            { id: 'contract', icon: '📝', label: 'Shartnoma', href: '/?mode=contract', description: 'Xavf tahlili' },
            { id: 'blindsign', icon: '🔍', label: 'Blind Sign', href: '/?mode=tos', description: 'ToS tekshiruvi' },
            { id: 'marketplace', icon: '👨‍⚖️', label: 'Yuristlar', href: '/marketplace', description: 'Mutaxassislar' },
            { id: 'register', icon: '🤝', label: 'Hamkorlik', href: '/partners/register', description: "Ro'yxatdan o'tish" },
        ]
    },
    ru: {
        title: "Сервисы",
        apps: [
            { id: 'chat', icon: '🤖', label: 'AI Чат', href: '/', description: 'Юридическая помощь' },
            { id: 'imtiyoz', icon: '💰', label: 'Льготы', href: '/?mode=imtiyoz', description: 'Субсидии (T-3)' },
            { id: 'contract', icon: '📝', label: 'Договор', href: '/?mode=contract', description: 'Анализ рисков' },
            { id: 'blindsign', icon: '🔍', label: 'Blind Sign', href: '/?mode=tos', description: 'Проверка ToS' },
            { id: 'marketplace', icon: '👨‍⚖️', label: 'Юристы', href: '/marketplace', description: 'Специалисты' },
            { id: 'register', icon: '🤝', label: 'Партнёрство', href: '/partners/register', description: 'Регистрация' },
        ]
    }
};

export default function AppLauncher({ lang = 'uz', onClose }) {
    const router = useRouter();
    const t = translations[lang];
    const ref = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleAppClick = (href) => {
        router.push(href);
        onClose();
    };

    return (
        <div className="app-launcher" ref={ref}>
            <div className="app-launcher-header">
                {t.title}
            </div>
            <div className="app-launcher-grid">
                {t.apps.map((app) => (
                    <button
                        key={app.id}
                        className="app-item"
                        onClick={() => handleAppClick(app.href)}
                    >
                        <div className="app-icon">{app.icon}</div>
                        <div className="app-label">{app.label}</div>
                        <div className="app-desc">{app.description}</div>
                    </button>
                ))}
            </div>

            <style jsx>{`
                .app-launcher {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    width: 320px;
                    background: white;
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    box-shadow: var(--shadow-xl);
                    overflow: hidden;
                    animation: slideIn 0.2s ease-out;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .app-launcher-header {
                    padding: 1rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-muted);
                    border-bottom: 1px solid var(--border-light);
                }

                .app-launcher-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem;
                    padding: 1rem;
                }

                .app-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0.75rem 0.5rem;
                    background: transparent;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .app-item:hover {
                    background: var(--bg-hover);
                    transform: translateY(-2px);
                }

                .app-icon {
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    background: var(--bg-tertiary);
                    border-radius: 12px;
                    margin-bottom: 0.5rem;
                    transition: all 0.2s;
                }

                .app-item:hover .app-icon {
                    background: var(--accent-gradient-soft);
                    transform: scale(1.05);
                }

                .app-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 0.125rem;
                }

                .app-desc {
                    font-size: 0.625rem;
                    color: var(--text-muted);
                    text-align: center;
                }
            `}</style>
        </div>
    );
}
