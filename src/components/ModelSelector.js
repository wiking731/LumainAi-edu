'use client';

import { useState, useRef, useEffect } from 'react';

const models = [
    { id: 'llama', name: 'Llama 3.3 70B', provider: 'Groq', icon: '🦙' },
    { id: 'gemini', name: 'Gemini 1.5 Flash', provider: 'Google', icon: '✨' },
    { id: 'gpt', name: 'GPT-4o', provider: 'OpenAI', icon: '🤖', disabled: true },
];

export default function ModelSelector({ currentModel = 'llama', onModelChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const current = models.find(m => m.id === currentModel) || models[0];

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="model-selector" ref={ref}>
            <button
                className="model-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="model-name">{current.icon} {current.name.split(' ')[0]}</span>
                <span className="model-arrow">▾</span>
            </button>

            {isOpen && (
                <div className="model-dropdown">
                    <div className="model-header">Model</div>
                    {models.map((model) => (
                        <button
                            key={model.id}
                            className={`model-item ${currentModel === model.id ? 'active' : ''} ${model.disabled ? 'disabled' : ''}`}
                            onClick={() => {
                                if (!model.disabled) {
                                    onModelChange(model.id);
                                    setIsOpen(false);
                                }
                            }}
                            disabled={model.disabled}
                        >
                            <span className="model-icon">{model.icon}</span>
                            <div className="model-info">
                                <span className="model-label">{model.name}</span>
                                <span className="model-provider">{model.provider}</span>
                            </div>
                            {currentModel === model.id && <span className="model-check">✓</span>}
                            {model.disabled && <span className="model-soon">Tez kunda</span>}
                        </button>
                    ))}
                </div>
            )}

            <style jsx>{`
                .model-selector {
                    position: relative;
                }

                .model-trigger {
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.375rem 0.625rem;
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    font-size: 0.8125rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.15s ease;
                }

                .model-trigger:hover {
                    background: var(--bg-hover);
                    border-color: var(--accent-primary);
                    color: var(--text-primary);
                }

                .model-arrow {
                    font-size: 0.625rem;
                    opacity: 0.6;
                }

                .model-dropdown {
                    position: absolute;
                    bottom: calc(100% + 8px);
                    right: 0;
                    min-width: 220px;
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

                .model-header {
                    padding: 0.75rem 1rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-muted);
                    border-bottom: 1px solid var(--border-light);
                }

                .model-item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    transition: all 0.15s ease;
                    text-align: left;
                }

                .model-item:hover:not(.disabled) {
                    background: var(--bg-hover);
                }

                .model-item.active {
                    background: var(--accent-gradient-soft);
                }

                .model-item.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .model-icon {
                    font-size: 1.25rem;
                }

                .model-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .model-label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-primary);
                }

                .model-provider {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .model-check {
                    color: var(--accent-primary);
                    font-weight: 600;
                }

                .model-soon {
                    font-size: 0.625rem;
                    padding: 0.125rem 0.375rem;
                    background: var(--warning-bg);
                    color: var(--warning);
                    border-radius: 4px;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
}
