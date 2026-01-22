'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

const translations = {
    uz: {
        title: "Advo AI",
        back: "Orqaga",
        newChat: "Yangi suhbat",
        history: "Tarix",
        today: "Bugun",
        yesterday: "Kecha",
        thisWeek: "Bu hafta",
        disclaimer: "Advo AI yuridik maslahatchi emas. Jiddiy holatlarda advokatga murojaat qiling.",

        // Legal mode
        legalTitle: "Huquqiy Tahlil",
        legalSubtitle: "Lex.uz asosida",
        legalPlaceholder: "Vaziyatingizni tasvirlab bering...",
        legalWelcome: "Assalomu alaykum! 👋",
        legalWelcomeSubtitle: "Vaziyatingizni tasvirlab bering - men O'zbekiston qonunlari asosida huquq va majburiyatlaringizni tahlil qilaman.",
        legalExamples: [
            "Ish beruvchi meni ogohlantirmasdan ishdan bo'shatdi",
            "Qo'shni qurilishi mening hududimga kirib kelmoqda",
            "Do'kon sifatsiz tovar sotdi, pulimni qaytarmayapti"
        ],

        // ToS mode
        tosTitle: "Shartnoma Tekshiruvi",
        tosSubtitle: "Shartlar himoyachisi",
        tosPlaceholder: "Shartnoma yoki maxfiylik siyosati matnini kiriting...",
        tosWelcome: "Salom! 🛡️",
        tosWelcomeSubtitle: "Shartnoma yoki maxfiylik siyosati matnini kiriting - men yashirin xavflarni topib, xavf darajasini baholayman.",
        tosExamples: [
            "Instagram foydalanish shartlarini tekshiring",
            "Bu maxfiylik siyosatida xavf bormi?",
            "[Matnni kiriting va tahlil so'rang]"
        ],

        send: "→",
        thinking: "Tahlil qilinmoqda"
    },
    ru: {
        title: "Advo AI",
        back: "Назад",
        newChat: "Новый чат",
        history: "История",
        today: "Сегодня",
        yesterday: "Вчера",
        thisWeek: "На этой неделе",
        disclaimer: "Advo AI не является юридическим консультантом. В серьезных случаях обратитесь к адвокату.",

        // Legal mode
        legalTitle: "Правовой Анализ",
        legalSubtitle: "На основе Lex.uz",
        legalPlaceholder: "Опишите вашу ситуацию...",
        legalWelcome: "Здравствуйте! 👋",
        legalWelcomeSubtitle: "Опишите вашу ситуацию - я проанализирую ваши права и обязанности на основе законов Узбекистана.",
        legalExamples: [
            "Работодатель уволил меня без предупреждения",
            "Строительство соседа заходит на мою территорию",
            "Магазин продал некачественный товар, не возвращает деньги"
        ],

        // ToS mode
        tosTitle: "Проверка Договоров",
        tosSubtitle: "Защитник условий",
        tosPlaceholder: "Вставьте текст договора или политики конфиденциальности...",
        tosWelcome: "Привет! 🛡️",
        tosWelcomeSubtitle: "Вставьте текст договора или политики конфиденциальности - я найду скрытые риски и оценю уровень опасности.",
        tosExamples: [
            "Проверьте условия использования Instagram",
            "Есть ли риски в этой политике конфиденциальности?",
            "[Вставьте текст и попросите анализ]"
        ],

        send: "→",
        thinking: "Анализирую"
    }
};

const generateId = () => Math.random().toString(36).substring(2, 9);

function ChatContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const lang = searchParams.get('lang') || 'uz';
    const mode = searchParams.get('mode') || 'legal'; // 'legal' or 'tos'
    const t = translations[lang];

    const isLegal = mode === 'legal';
    const title = isLegal ? t.legalTitle : t.tosTitle;
    const subtitle = isLegal ? t.legalSubtitle : t.tosSubtitle;
    const placeholder = isLegal ? t.legalPlaceholder : t.tosPlaceholder;
    const welcome = isLegal ? t.legalWelcome : t.tosWelcome;
    const welcomeSubtitle = isLegal ? t.legalWelcomeSubtitle : t.tosWelcomeSubtitle;
    const examples = isLegal ? t.legalExamples : t.tosExamples;
    const icon = isLegal ? '⚖️' : '🛡️';
    const accentColor = isLegal ? 'var(--accent-primary)' : 'var(--warning)';

    // Chat states
    const [chatHistory, setChatHistory] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`advoai_history_${mode}`);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(`advoai_history_${mode}`, JSON.stringify(chatHistory));
        }
    }, [chatHistory, mode]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    const startNewChat = () => {
        const newId = generateId();
        setCurrentChatId(newId);
        setMessages([]);
    };

    const loadChat = (chatId) => {
        const chat = chatHistory.find(c => c.id === chatId);
        if (chat) {
            setCurrentChatId(chatId);
            setMessages(chat.messages);
        }
    };

    const updateChatHistory = (newMessages) => {
        if (!currentChatId) return;

        const title = newMessages[0]?.content?.substring(0, 40) + '...' || 'New Chat';
        const existingIndex = chatHistory.findIndex(c => c.id === currentChatId);

        if (existingIndex >= 0) {
            const updated = [...chatHistory];
            updated[existingIndex] = {
                ...updated[existingIndex],
                messages: newMessages,
                updatedAt: new Date().toISOString()
            };
            setChatHistory(updated);
        } else {
            setChatHistory([
                { id: currentChatId, title, messages: newMessages, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
                ...chatHistory
            ]);
        }
    };

    const deleteChat = (chatId, e) => {
        e.stopPropagation();
        setChatHistory(chatHistory.filter(c => c.id !== chatId));
        if (currentChatId === chatId) startNewChat();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        if (!currentChatId) {
            setCurrentChatId(generateId());
        }

        const userMessage = input.trim();
        setInput('');
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        // Add empty AI message that will be filled by streaming
        const streamingMessages = [...newMessages, { role: 'assistant', content: '' }];
        setMessages(streamingMessages);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    language: lang,
                    mode: mode,
                    history: messages.slice(-6)
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Server error');
            }

            // Handle streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                accumulatedContent += parsed.content;
                                // Update the last message with accumulated content
                                setMessages(prev => {
                                    const updated = [...prev];
                                    updated[updated.length - 1] = {
                                        role: 'assistant',
                                        content: accumulatedContent
                                    };
                                    return updated;
                                });
                            }
                            if (parsed.error) {
                                throw new Error(parsed.error);
                            }
                        } catch (parseError) {
                            // Skip invalid JSON
                        }
                    }
                }
            }

            // Final update and save to history
            const finalMessages = [...newMessages, { role: 'assistant', content: accumulatedContent }];
            setMessages(finalMessages);
            updateChatHistory(finalMessages);

        } catch (error) {
            const errorMsg = lang === 'uz' ? `❌ Xatolik: ${error.message}` : `❌ Ошибка: ${error.message}`;
            const finalMessages = [...newMessages, { role: 'assistant', content: errorMsg }];
            setMessages(finalMessages);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExampleClick = (example) => {
        setInput(example);
        textareaRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-icon">{icon}</div>
                        <span className="sidebar-logo-text" style={{
                            background: isLegal ? 'var(--accent-gradient)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Advo AI
                        </span>
                    </div>
                </div>

                <div className="sidebar-content">
                    <button className="new-chat-btn" onClick={startNewChat} style={{
                        background: isLegal ? 'var(--accent-gradient)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    }}>
                        <span>+</span> {t.newChat}
                    </button>

                    <div className="sidebar-section" style={{ marginTop: '1.5rem' }}>
                        <div className="sidebar-section-title">{t.history}</div>
                        {chatHistory.length === 0 ? (
                            <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.3 }}>{icon}</div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    {lang === 'uz' ? "Hali suhbatlar yo'q" : "Пока нет чатов"}
                                </p>
                            </div>
                        ) : (
                            <div className="history-list">
                                {chatHistory.slice(0, 10).map(chat => (
                                    <div
                                        key={chat.id}
                                        className={`history-item ${currentChatId === chat.id ? 'active' : ''}`}
                                        onClick={() => loadChat(chat.id)}
                                    >
                                        <div className="history-item-icon">{icon}</div>
                                        <div className="history-item-content">
                                            <div className="history-item-title">{chat.title}</div>
                                        </div>
                                        <button
                                            className="btn btn-ghost btn-icon"
                                            onClick={(e) => deleteChat(chat.id, e)}
                                            style={{ padding: '0.25rem', fontSize: '0.875rem', opacity: 0.5 }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="sidebar-footer">
                    <button
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                        onClick={() => router.push(`/individual?lang=${lang}`)}
                    >
                        ← {t.back}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="main-content">
                <div className="chat-container">
                    {/* Header */}
                    <header className="chat-header">
                        <div className="chat-header-title">
                            <div className="chat-header-icon" style={{
                                background: isLegal ? 'var(--accent-gradient)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                            }}>{icon}</div>
                            <div>
                                <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h1>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{subtitle}</p>
                            </div>
                        </div>
                        <div className="language-selector" style={{ marginBottom: 0 }}>
                            <button
                                className={`lang-btn ${lang === 'uz' ? 'active' : ''}`}
                                onClick={() => router.push(`/chat?lang=uz&mode=${mode}`)}
                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
                            >
                                🇺🇿
                            </button>
                            <button
                                className={`lang-btn ${lang === 'ru' ? 'active' : ''}`}
                                onClick={() => router.push(`/chat?lang=ru&mode=${mode}`)}
                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
                            >
                                🇷🇺
                            </button>
                        </div>
                    </header>

                    {/* Messages */}
                    <div className="chat-messages">
                        {messages.length === 0 ? (
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: '2rem'
                            }}>
                                <div style={{
                                    width: 80,
                                    height: 80,
                                    background: isLegal ? 'var(--accent-gradient)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    borderRadius: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2.5rem',
                                    marginBottom: '1.5rem',
                                    boxShadow: isLegal ? 'var(--accent-glow)' : '0 8px 32px rgba(245, 158, 11, 0.25)'
                                }}>
                                    {icon}
                                </div>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{welcome}</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 450 }}>
                                    {welcomeSubtitle}
                                </p>

                                <div className="examples-container" style={{ maxWidth: 550, width: '100%' }}>
                                    <p className="examples-title">{lang === 'uz' ? 'Namunalar:' : 'Примеры:'}</p>
                                    <div className="examples-grid" style={{ justifyContent: 'center' }}>
                                        {examples.map((example, idx) => (
                                            <button
                                                key={idx}
                                                className="example-btn"
                                                onClick={() => handleExampleClick(example)}
                                            >
                                                {example}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`message ${msg.role === 'user' ? 'message-user' : 'message-ai'}`}>
                                        {msg.role === 'assistant' && (
                                            <div className="message-header">
                                                <div className="message-avatar" style={{
                                                    background: isLegal ? 'var(--accent-gradient)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                                }}>{icon}</div>
                                                <span className="message-name">Advo AI</span>
                                            </div>
                                        )}
                                        <div className="message-bubble" style={msg.role === 'user' ? {
                                            background: isLegal ? 'var(--accent-gradient)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                        } : {}}>
                                            <div className="message-content">
                                                {msg.role === 'assistant' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : <p>{msg.content}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="message message-ai">
                                        <div className="message-header">
                                            <div className="message-avatar" style={{
                                                background: isLegal ? 'var(--accent-gradient)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                            }}>{icon}</div>
                                            <span className="message-name">Advo AI</span>
                                        </div>
                                        <div className="typing-indicator">
                                            <span>{t.thinking}</span>
                                            <div className="loading-dots">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chat-input-container">
                        <form onSubmit={handleSubmit} className="chat-input-wrapper">
                            <textarea
                                ref={textareaRef}
                                className="chat-input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                rows={1}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="chat-send-btn"
                                disabled={isLoading || !input.trim()}
                                style={{
                                    background: isLegal ? 'var(--accent-gradient)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                }}
                            >
                                {isLoading ? '...' : '→'}
                            </button>
                        </form>
                        <p className="disclaimer" style={{ textAlign: 'center', marginTop: '1rem' }}>{t.disclaimer}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="dashboard" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
                    <div className="loading-dots"><span></span><span></span><span></span></div>
                </div>
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
