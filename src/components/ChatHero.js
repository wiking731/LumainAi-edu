'use client';

import { useState, useRef, useEffect } from 'react';
import ToolsMenu from './ToolsMenu';
import ModelSelector from './ModelSelector';
import FileUpload from './FileUpload';

const translations = {
    uz: {
        placeholder: "Huquqiy savolingizni yozing...",
        examples: [
            "25 yoshdaman, IT kompaniya ochmoqchiman",
            "Ish beruvchi meni ogohlantirmasdan ishdan bo'shatdi",
            "Bu shartnomani tekshirib bering"
        ],
        powered: "Gemini + Groq AI asosida",
        tools: "Vositalar"
    },
    ru: {
        placeholder: "Напишите ваш юридический вопрос...",
        examples: [
            "Мне 25 лет, хочу открыть IT-компанию",
            "Работодатель уволил меня без предупреждения",
            "Проверьте этот договор"
        ],
        powered: "На основе Gemini + Groq AI",
        tools: "Инструменты"
    }
};

const modeInfo = {
    uz: {
        imtiyoz: { icon: '💰', label: 'Imtiyozlar' },
        contract: { icon: '📝', label: 'Shartnoma' },
        tos: { icon: '🔍', label: 'Shartlar' },
        legal: { icon: '⚖️', label: 'Umumiy' }
    },
    ru: {
        imtiyoz: { icon: '💰', label: 'Льготы' },
        contract: { icon: '📝', label: 'Договор' },
        tos: { icon: '🔍', label: 'Условия' },
        legal: { icon: '⚖️', label: 'Общее' }
    }
};

export default function ChatHero({ lang = 'uz', mode, onSubmit, onModeChange }) {
    const [input, setInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showTools, setShowTools] = useState(false);
    const [model, setModel] = useState('llama');
    const [fileContent, setFileContent] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [fileError, setFileError] = useState(null);
    const textareaRef = useRef(null);
    const t = translations[lang];
    const currentModeInfo = modeInfo[lang][mode] || modeInfo[lang].legal;

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, 200);
            textarea.style.height = newHeight + 'px';
        }
    }, [input]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const textToSubmit = fileContent
            ? `[Fayl: ${fileName}]\n\n${fileContent}\n\n${input}`
            : input.trim();

        if (textToSubmit) {
            onSubmit(textToSubmit, model);
            setInput('');
            setFileContent(null);
            setFileName(null);
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleExampleClick = (example) => {
        setInput(example);
        textareaRef.current?.focus();
    };

    const handleFileContent = (content, name) => {
        setFileContent(content);
        setFileName(name);
        setFileError(null);
    };

    const handleFileError = (error) => {
        setFileError(error);
        setTimeout(() => setFileError(null), 3000);
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

            {/* Mode Pills (shown on landing) */}
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
                    🔍 {lang === 'uz' ? 'Shartlar tekshiruvi' : 'Проверка условий'}
                </button>
                <button
                    className={`mode-pill ${mode === 'legal' ? 'active' : ''}`}
                    onClick={() => onModeChange('legal')}
                >
                    ⚖️ {lang === 'uz' ? 'Umumiy' : 'Общее'}
                </button>
            </div>

            {/* Gemini-style Input Box */}
            <form className={`gemini-input-box ${isFocused ? 'focused' : ''}`} onSubmit={handleSubmit}>
                {/* Row 1: Textarea */}
                <div className="input-row-1">
                    <textarea
                        ref={textareaRef}
                        className="gemini-textarea"
                        placeholder={t.placeholder}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        rows={1}
                    />
                </div>

                {/* File Error */}
                {fileError && (
                    <div className="file-error">{fileError}</div>
                )}

                {/* Row 2: Tools & Send */}
                <div className="input-row-2">
                    <div className="input-tools-left">
                        {/* File Upload */}
                        <FileUpload
                            lang={lang}
                            onFileContent={handleFileContent}
                            onError={handleFileError}
                        />

                        {/* Tools Dropdown Button */}
                        <div className="tools-wrapper">
                            <button
                                type="button"
                                className="tools-btn"
                                onClick={() => setShowTools(!showTools)}
                            >
                                <span className="tools-icon">🔧</span>
                                <span className="tools-label">{currentModeInfo.icon} {currentModeInfo.label}</span>
                                <span className="tools-arrow">▾</span>
                            </button>
                            {showTools && (
                                <ToolsMenu
                                    lang={lang}
                                    currentMode={mode}
                                    onModeChange={onModeChange}
                                    onClose={() => setShowTools(false)}
                                />
                            )}
                        </div>
                    </div>

                    <div className="input-tools-right">
                        {/* Model Selector */}
                        <ModelSelector
                            currentModel={model}
                            onModelChange={setModel}
                        />

                        {/* Send Button */}
                        <button
                            type="submit"
                            className="send-btn"
                            disabled={!input.trim() && !fileContent}
                        >
                            →
                        </button>
                    </div>
                </div>
            </form>

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
                    margin-bottom: 1.5rem;
                }

                .mode-pills {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                }

                .mode-pill {
                    padding: 0.625rem 1.25rem;
                    font-size: 0.9375rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    background: var(--bg-secondary);
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

                /* Gemini-style Input Box */
                .gemini-input-box {
                    width: 100%;
                    max-width: 700px;
                    background: var(--bg-secondary);
                    border: 2px solid var(--border-color);
                    border-radius: 24px;
                    padding: 1rem;
                    transition: all 0.3s ease;
                    box-shadow: var(--shadow-lg);
                }

                .gemini-input-box.focused {
                    border-color: var(--accent-primary);
                    box-shadow: var(--shadow-lg), 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                .input-row-1 {
                    padding: 0 0.5rem;
                }

                .gemini-textarea {
                    width: 100%;
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
                    padding: 0.5rem 0;
                }

                .gemini-textarea::placeholder {
                    color: var(--text-muted);
                }

                .file-error {
                    padding: 0.5rem 0.75rem;
                    margin: 0.5rem 0;
                    background: var(--danger-bg);
                    color: var(--danger);
                    border-radius: 8px;
                    font-size: 0.875rem;
                }

                .input-row-2 {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 0.75rem;
                    border-top: 1px solid var(--border-light);
                    margin-top: 0.75rem;
                }

                .input-tools-left {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .input-tools-right {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .tools-wrapper {
                    position: relative;
                }

                .tools-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.5rem 0.75rem;
                    background: transparent;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.15s ease;
                }

                .tools-btn:hover {
                    background: var(--bg-hover);
                    border-color: var(--accent-primary);
                }

                .tools-icon {
                    font-size: 1rem;
                }

                .tools-label {
                    font-weight: 500;
                }

                .tools-arrow {
                    font-size: 0.625rem;
                    opacity: 0.6;
                }

                .send-btn {
                    width: 44px;
                    height: 44px;
                    background: var(--accent-gradient);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    font-size: 1.25rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    box-shadow: var(--accent-glow);
                }

                .send-btn:hover:not(:disabled) {
                    transform: scale(1.05);
                }

                .send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Examples */
                .hero-examples {
                    margin-top: 2rem;
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

                    .gemini-input-box {
                        padding: 0.75rem;
                    }

                    .gemini-textarea {
                        font-size: 1rem;
                    }

                    .tools-label {
                        display: none;
                    }

                    .send-btn {
                        width: 40px;
                        height: 40px;
                    }
                }
            `}</style>
        </div>
    );
}
