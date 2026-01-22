'use client';

import { useState, useRef, useEffect } from 'react';

const translations = {
    uz: {
        tools: "Vositalar",
        items: [
            { id: 'imtiyoz', icon: '💰', label: 'Imtiyozlar', mode: 'imtiyoz' },
            { id: 'contract', icon: '📝', label: 'Shartnoma', mode: 'contract' },
            { id: 'tos', icon: '🔍', label: 'Shartlar', mode: 'tos' },
            { id: 'legal', icon: '⚖️', label: 'Umumiy', mode: 'legal' },
        ]
    },
    ru: {
        tools: "Инструменты",
        items: [
            { id: 'imtiyoz', icon: '💰', label: 'Льготы', mode: 'imtiyoz' },
            { id: 'contract', icon: '📝', label: 'Договор', mode: 'contract' },
            { id: 'tos', icon: '🔍', label: 'Условия', mode: 'tos' },
            { id: 'legal', icon: '⚖️', label: 'Общее', mode: 'legal' },
        ]
    }
};

export default function ToolsMenu({ lang = 'uz', currentMode, onModeChange, onClose }) {
    const ref = useRef(null);
    const t = translations[lang];

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div className="tools-menu" ref={ref}>
            <div className="tools-header">{t.tools}</div>
            <div className="tools-list">
                {t.items.map((item) => (
                    <button
                        key={item.id}
                        className={`tool-item ${currentMode === item.mode ? 'active' : ''}`}
                        onClick={() => {
                            onModeChange(item.mode);
                            onClose();
                        }}
                    >
                        <span className="tool-icon">{item.icon}</span>
                        <span className="tool-label">{item.label}</span>
                        {currentMode === item.mode && <span className="tool-check">✓</span>}
                    </button>
                ))}
            </div>

            <style jsx>{`
                .tools-menu {
                    position: absolute;
                    bottom: calc(100% + 8px);
                    left: 0;
                    min-width: 200px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    box-shadow: var(--shadow-lg);
                    overflow: hidden;
                    animation: slideUp 0.15s ease-out;
                    z-index: 100;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .tools-header {
                    padding: 0.75rem 1rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-muted);
                    border-bottom: 1px solid var(--border-light);
                }

                .tools-list {
                    padding: 0.5rem;
                }

                .tool-item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.625rem 0.75rem;
                    background: transparent;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.15s ease;
                    text-align: left;
                }

                .tool-item:hover {
                    background: var(--bg-hover);
                }

                .tool-item.active {
                    background: var(--accent-gradient-soft);
                }

                .tool-icon {
                    font-size: 1.125rem;
                }

                .tool-label {
                    flex: 1;
                    font-size: 0.9375rem;
                    font-weight: 500;
                    color: var(--text-primary);
                }

                .tool-check {
                    color: var(--accent-primary);
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
}
