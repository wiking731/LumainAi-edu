'use client';

import { useState, useRef, useEffect } from 'react';

const translations = {
    uz: {
        placeholder: "Huquqiy savolingizni yozing...",
        examples: [
            "25 yoshdaman, IT kompaniya ochmoqchiman",
            "Ish beruvchi meni ogohlantirmasdan ishdan bo'shatdi",
            "Bu shartnomani tekshirib bering"
        ],
        powered: "Gemini + Groq AI asosida"
    },
    ru: {
        placeholder: "Напишите ваш юридический вопрос...",
        examples: [
            "Мне 25 лет, хочу открыть IT-компанию",
            "Работодатель уволил меня без предупреждения",
            "Проверьте этот договор"
        ],
        powered: "На основе Gemini + Groq AI"
    }
};

export default function ChatHero({ lang = 'uz', mode, onSubmit, onModeChange }) {
    const [input, setInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef(null);
    const t = translations[lang];

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, 200); // max 200px
            textarea.style.height = newHeight + 'px';
        }
    }, [input]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSubmit(input.trim());
            setInput('');
            // Reset height after submit
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e) => {
        // Submit on Enter without Shift
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleExampleClick = (example) => {
        setInput(example);
        textareaRef.current?.focus();
    };

    return (
        <div className="chat-hero">
            {/* Logo */}
            <div className="hero-logo-large">⚖️</div>
            <h1 className="hero-title-large">AdvoAI</h1>
            <p className="hero-subtitle-large">
                {lang === 'uz'
                    ? "O'zbekistonning Huquqiy Yordamchisi"
                    : "Юридический Помощник Узбекистана"}
            </p>

            {/* Search Input */}
            <form className={`hero-search ${isFocused ? 'focused' : ''}`} onSubmit={handleSubmit}>
                <div className="search-icon">💬</div>
                <textarea
                    ref={textareaRef}
                    className="search-input"
                    placeholder={t.placeholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    rows={1}
                />
                <button
                    type="submit"
                    className="search-submit"
                    disabled={!input.trim()}
                >
                    →
                </button>
            </form>

            {/* Mode Pills */}
            <div className="mode-pills">
                <button
                    className={`mode-pill ${mode === 'imtiyoz' ? 'active' : ''}`}
                    onClick={() => onModeChange('imtiyoz')}
                >
                    💰 {lang === 'uz' ? 'Imtiyozlar' : 'Льготы'}
                </button>
                <button
                    className={`mode-pill ${mode === 'contract' ? 'active' : ''}`}
                    onClick={() => onModeChange('contract')}
                >
                    📝 {lang === 'uz' ? 'Shartnoma' : 'Договор'}
                </button>
                <button
                    className={`mode-pill ${mode === 'tos' ? 'active' : ''}`}
                    onClick={() => onModeChange('tos')}
                >
                    🔍 Blind Sign
                </button>
                <button
                    className={`mode-pill ${mode === 'legal' ? 'active' : ''}`}
                    onClick={() => onModeChange('legal')}
                >
                    ⚖️ {lang === 'uz' ? 'Umumiy' : 'Общее'}
                </button>
            </div>

            {/* Example Queries */}
            <div className="hero-examples">
                <p className="examples-label">{lang === 'uz' ? 'Namunalar:' : 'Примеры:'}</p>
                <div className="examples-list">
                    {t.examples.map((example, idx) => (
                        <button
                            key={idx}
                            className="example-chip"
                            onClick={() => handleExampleClick(example)}
                        >
                            {example}
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer Links */}
            <div className="hero-footer">
                <a href="/marketplace" className="footer-link">
                    👨‍⚖️ {lang === 'uz' ? 'Yuristlar katalogi' : 'Каталог юристов'}
                </a>
                <span className="footer-divider">|</span>
                <a href="/partners/register" className="footer-link">
                    🤝 {lang === 'uz' ? 'Hamkorlar uchun' : 'Для партнёров'}
                </a>
            </div>

            <p className="powered-by">{t.powered}</p>

            <style jsx>{`
                .chat-hero {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: calc(100vh - 64px);
                    padding: 2rem;
                    text-align: center;
                }

                .hero-logo-large {
                    width: 100px;
                    height: 100px;
                    background: var(--accent-gradient);
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    margin-bottom: 1.5rem;
                    box-shadow: var(--accent-glow-strong);
                    animation: float 4s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .hero-title-large {
                    font-size: 3.5rem;
                    font-weight: 800;
                    background: var(--accent-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.5rem;
                }

                .hero-subtitle-large {
                    font-size: 1.25rem;
                    color: var(--text-secondary);
                    margin-bottom: 2.5rem;
                }

                .hero-search {
                    display: flex;
                    align-items: flex-end;
                    width: 100%;
                    max-width: 640px;
                    background: white;
                    border: 2px solid var(--border-color);
                    border-radius: 28px;
                    padding: 0.75rem 0.75rem 0.75rem 1.5rem;
                    box-shadow: var(--shadow-lg);
                    transition: all 0.3s ease;
                }

                .hero-search.focused {
                    border-color: var(--accent-primary);
                    box-shadow: var(--shadow-lg), 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                .search-icon {
                    font-size: 1.25rem;
                    margin-right: 0.75rem;
                    margin-bottom: 0.5rem;
                    align-self: flex-start;
                    padding-top: 0.25rem;
                }

                .search-input {
                    flex: 1;
                    border: none;
                    outline: none;
                    font-size: 1.125rem;
                    font-family: inherit;
                    background: transparent;
                    color: var(--text-primary);
                    resize: none;
                    min-height: 28px;
                    max-height: 200px;
                    overflow-y: auto;
                    line-height: 1.5;
                    padding: 0;
                }

                .search-input::placeholder {
                    color: var(--text-muted);
                }

                .search-submit {
                    width: 48px;
                    height: 48px;
                    background: var(--accent-gradient);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    box-shadow: var(--accent-glow);
                }

                .search-submit:hover:not(:disabled) {
                    transform: scale(1.05);
                }

                .search-submit:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .mode-pills {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                    margin-bottom: 2rem;
                }

                .mode-pill {
                    padding: 0.625rem 1.25rem;
                    font-size: 0.9375rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    background: white;
                    border: 1px solid var(--border-color);
                    border-radius: 9999px;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: var(--shadow-sm);
                }

                .mode-pill:hover {
                    border-color: var(--accent-primary);
                    color: var(--accent-primary);
                    transform: translateY(-2px);
                }

                .mode-pill.active {
                    background: var(--accent-gradient);
                    color: white;
                    border-color: transparent;
                    box-shadow: var(--accent-glow);
                }

                .hero-examples {
                    margin-bottom: 2rem;
                }

                .examples-label {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    margin-bottom: 0.75rem;
                }

                .examples-list {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .example-chip {
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-light);
                    border-radius: 9999px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .example-chip:hover {
                    background: var(--accent-gradient-soft);
                    border-color: var(--accent-primary);
                    color: var(--accent-primary);
                }

                .hero-footer {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .footer-link {
                    font-size: 0.9375rem;
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .footer-link:hover {
                    color: var(--accent-primary);
                }

                .footer-divider {
                    color: var(--border-color);
                }

                .powered-by {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                @media (max-width: 640px) {
                    .hero-title-large {
                        font-size: 2.5rem;
                    }

                    .hero-search {
                        padding: 0.375rem 0.375rem 0.375rem 1rem;
                    }

                    .search-input {
                        font-size: 1rem;
                    }

                    .search-submit {
                        width: 40px;
                        height: 40px;
                        font-size: 1.25rem;
                    }
                }
            `}</style>
        </div>
    );
}
