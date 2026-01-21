'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ChatHero from '@/components/ChatHero';
import SmartCard from '@/components/SmartCard';

const translations = {
  uz: {
    thinking: "Tahlil qilinmoqda",
    disclaimer: "AdvoAI yuridik maslahatchi emas. Jiddiy holatlarda advokatga murojaat qiling.",
    newChat: "Yangi suhbat",
    mode: "Rejim"
  },
  ru: {
    thinking: "Анализирую",
    disclaimer: "AdvoAI не является юридическим консультантом. В серьезных случаях обратитесь к адвокату.",
    newChat: "Новый чат",
    mode: "Режим"
  }
};

const modeLabels = {
  uz: {
    imtiyoz: "💰 Imtiyozlar (T-3)",
    contract: "📝 Shartnoma tahlili",
    tos: "🔍 Blind Sign",
    legal: "⚖️ Umumiy maslahat"
  },
  ru: {
    imtiyoz: "💰 Льготы (T-3)",
    contract: "📝 Анализ договора",
    tos: "🔍 Blind Sign",
    legal: "⚖️ Общая консультация"
  }
};

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get('lang') || 'uz';
  const initialMode = searchParams.get('mode') || 'legal';

  const [mode, setMode] = useState(initialMode);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);
  const t = translations[lang];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize chat input textarea
  useEffect(() => {
    const textarea = chatInputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 150); // max 150px in chat
      textarea.style.height = newHeight + 'px';
    }
  }, [chatInput]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const handleSubmit = async (input) => {
    if (!input.trim() || isLoading) return;

    // Show chat interface
    setShowChat(true);

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    // Add empty AI message for streaming
    setMessages([...newMessages, { role: 'assistant', content: '' }]);

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

      // Handle streaming
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
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: accumulatedContent
                  };
                  return updated;
                });
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

    } catch (error) {
      const errorMsg = lang === 'uz'
        ? `❌ Xatolik: ${error.message}`
        : `❌ Ошибка: ${error.message}`;
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: errorMsg };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setShowChat(false);
  };

  return (
    <div className="app-container">
      <Navbar lang={lang} />

      <main className="main-content">
        {!showChat ? (
          // Hero / Landing State
          <ChatHero
            lang={lang}
            mode={mode}
            onSubmit={handleSubmit}
            onModeChange={handleModeChange}
          />
        ) : (
          // Chat State
          <div className="chat-fullscreen">
            {/* Chat Header */}
            <div className="chat-header-bar">
              <button
                className="btn btn-ghost"
                onClick={handleNewChat}
              >
                ← {t.newChat}
              </button>
              <div className="mode-indicator">
                {t.mode}: {modeLabels[lang][mode]}
              </div>
              <select
                className="mode-select"
                value={mode}
                onChange={(e) => handleModeChange(e.target.value)}
              >
                <option value="legal">{modeLabels[lang].legal}</option>
                <option value="imtiyoz">{modeLabels[lang].imtiyoz}</option>
                <option value="contract">{modeLabels[lang].contract}</option>
                <option value="tos">{modeLabels[lang].tos}</option>
              </select>
            </div>

            {/* Messages */}
            <div className="chat-messages-container">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role === 'user' ? 'message-user' : 'message-ai'}`}>
                  {msg.role === 'assistant' && (
                    <div className="message-header">
                      <div className="message-avatar">🤖</div>
                      <span className="message-name">AdvoAI</span>
                    </div>
                  )}
                  <div className="message-bubble">
                    {msg.role === 'assistant' ? (
                      <SmartCard content={msg.content} lang={lang} />
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.content === '' && (
                <div className="typing-indicator">
                  <span>{t.thinking}</span>
                  <div className="loading-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-bar">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (chatInput.trim() && !isLoading) {
                  handleSubmit(chatInput);
                  setChatInput('');
                  if (chatInputRef.current) {
                    chatInputRef.current.style.height = 'auto';
                  }
                }
              }}>
                <textarea
                  ref={chatInputRef}
                  name="message"
                  className="chat-input-field"
                  placeholder={lang === 'uz' ? "Davom eting..." : "Продолжите..."}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (chatInput.trim() && !isLoading) {
                        handleSubmit(chatInput);
                        setChatInput('');
                        if (chatInputRef.current) {
                          chatInputRef.current.style.height = 'auto';
                        }
                      }
                    }
                  }}
                  disabled={isLoading}
                  rows={1}
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={isLoading || !chatInput.trim()}
                >
                  {isLoading ? '...' : '→'}
                </button>
              </form>
              <p className="disclaimer-small">{t.disclaimer}</p>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
                .app-container {
                    min-height: 100vh;
                    background: linear-gradient(180deg, #fafbfc 0%, #f0f4ff 50%, #fafbfc 100%);
                }

                .main-content {
                    padding-top: 64px;
                }

                .chat-fullscreen {
                    display: flex;
                    flex-direction: column;
                    height: calc(100vh - 64px);
                    max-width: 900px;
                    margin: 0 auto;
                }

                .chat-header-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid var(--border-light);
                    background: white;
                }

                .mode-indicator {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }

                .mode-select {
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    background: white;
                    cursor: pointer;
                }

                .chat-messages-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .message {
                    max-width: 85%;
                    animation: messageSlide 0.3s ease-out;
                }

                @keyframes messageSlide {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .message-user {
                    align-self: flex-end;
                }

                .message-user .message-bubble {
                    background: var(--accent-gradient);
                    color: white;
                    padding: 1rem 1.25rem;
                    border-radius: 20px 20px 4px 20px;
                    box-shadow: var(--accent-glow);
                }

                .message-user .message-bubble p {
                    margin: 0;
                }

                .message-ai {
                    align-self: flex-start;
                }

                .message-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }

                .message-avatar {
                    width: 28px;
                    height: 28px;
                    background: var(--accent-gradient);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.875rem;
                }

                .message-name {
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                }

                .message-ai .message-bubble {
                    background: transparent;
                }

                .typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    background: var(--bg-tertiary);
                    border-radius: 12px;
                    width: fit-content;
                }

                .typing-indicator span {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }

                .chat-input-bar {
                    padding: 1rem 1.5rem 1.5rem;
                    background: linear-gradient(to top, white 90%, transparent);
                }

                .chat-input-bar form {
                    display: flex;
                    align-items: flex-end;
                    gap: 0.75rem;
                    background: white;
                    border: 2px solid var(--border-color);
                    border-radius: 24px;
                    padding: 0.75rem;
                    box-shadow: var(--shadow-lg);
                }

                .chat-input-field {
                    flex: 1;
                    border: none;
                    outline: none;
                    padding: 0.5rem 1rem;
                    font-size: 1rem;
                    font-family: inherit;
                    background: transparent;
                    resize: none;
                    min-height: 24px;
                    max-height: 150px;
                    overflow-y: auto;
                    line-height: 1.5;
                }

                .chat-send-btn {
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
                }

                .chat-send-btn:hover:not(:disabled) {
                    transform: scale(1.05);
                }

                .chat-send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .disclaimer-small {
                    text-align: center;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    margin-top: 0.75rem;
                }
            `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #fafbfc 0%, #f0f4ff 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
