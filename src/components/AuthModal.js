'use client';

import { useState } from 'react';

const translations = {
    uz: {
        title: "AdvoAI'ga kirish",
        subtitle: "Huquqiy yordamchingiz",
        selectRole: "Rolni tanlang",
        mijoz: "Mijoz",
        mijozDesc: "Huquqiy maslahat olish uchun",
        hamkor: "Hamkor",
        hamkorDesc: "Yurist sifatida ro'yxatdan o'tish",
        name: "Ism",
        phone: "Telefon",
        email: "Email (ixtiyoriy)",
        continue: "Davom etish",
        login: "Kirish",
        register: "Ro'yxatdan o'tish",
        hasAccount: "Akkauntingiz bormi?",
        noAccount: "Akkauntingiz yo'qmi?",
        orContinue: "yoki davom eting",
        guest: "Mehmon sifatida",
        privacyNote: "Ro'yxatdan o'tish orqali siz foydalanish shartlariga rozilik bildirasiz."
    },
    ru: {
        title: "Вход в AdvoAI",
        subtitle: "Ваш юридический помощник",
        selectRole: "Выберите роль",
        mijoz: "Клиент",
        mijozDesc: "Получить юридическую консультацию",
        hamkor: "Партнёр",
        hamkorDesc: "Регистрация как юрист",
        name: "Имя",
        phone: "Телефон",
        email: "Email (необязательно)",
        continue: "Продолжить",
        login: "Войти",
        register: "Регистрация",
        hasAccount: "Есть аккаунт?",
        noAccount: "Нет аккаунта?",
        orContinue: "или продолжить",
        guest: "Как гость",
        privacyNote: "Регистрируясь, вы соглашаетесь с условиями использования."
    }
};

export default function AuthModal({ lang = 'uz', isOpen, onClose, onAuth }) {
    const [mode, setMode] = useState('login'); // login, register
    const [role, setRole] = useState('mijoz'); // mijoz, hamkor
    const [form, setForm] = useState({ name: '', phone: '', email: '' });
    const [isLoading, setIsLoading] = useState(false);
    const t = translations[lang];

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate auth delay
        await new Promise(r => setTimeout(r, 1000));

        // Store in localStorage
        const userData = {
            name: form.name || 'Foydalanuvchi',
            phone: form.phone,
            email: form.email,
            role,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('advoai-user', JSON.stringify(userData));

        setIsLoading(false);
        onAuth?.(userData);
        onClose();
    };

    const handleGuestContinue = () => {
        const guestData = { name: 'Mehmon', role: 'guest' };
        localStorage.setItem('advoai-user', JSON.stringify(guestData));
        onAuth?.(guestData);
        onClose();
    };

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                {/* Close button */}
                <button className="close-btn" onClick={onClose}>×</button>

                {/* Header */}
                <div className="auth-header">
                    <div className="auth-logo">⚖️</div>
                    <h2>{t.title}</h2>
                    <p>{t.subtitle}</p>
                </div>

                {/* Role Selector */}
                <div className="role-selector">
                    <p className="role-label">{t.selectRole}</p>
                    <div className="role-options">
                        <button
                            className={`role-option ${role === 'mijoz' ? 'active' : ''}`}
                            onClick={() => setRole('mijoz')}
                        >
                            <span className="role-icon">👤</span>
                            <span className="role-name">{t.mijoz}</span>
                            <span className="role-desc">{t.mijozDesc}</span>
                        </button>
                        <button
                            className={`role-option ${role === 'hamkor' ? 'active' : ''}`}
                            onClick={() => setRole('hamkor')}
                        >
                            <span className="role-icon">👨‍⚖️</span>
                            <span className="role-name">{t.hamkor}</span>
                            <span className="role-desc">{t.hamkorDesc}</span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <div className="input-group">
                            <label>{t.name}</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Muhammad"
                                required
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label>{t.phone}</label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            placeholder="+998 90 123 45 67"
                            required
                        />
                    </div>

                    {mode === 'register' && (
                        <div className="input-group">
                            <label>{t.email}</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="email@example.com"
                            />
                        </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? '...' : (mode === 'login' ? t.login : t.register)}
                    </button>
                </form>

                {/* Mode Toggle */}
                <div className="mode-toggle">
                    {mode === 'login' ? (
                        <p>
                            {t.noAccount}{' '}
                            <button onClick={() => setMode('register')}>{t.register}</button>
                        </p>
                    ) : (
                        <p>
                            {t.hasAccount}{' '}
                            <button onClick={() => setMode('login')}>{t.login}</button>
                        </p>
                    )}
                </div>

                {/* Divider */}
                <div className="divider">
                    <span>{t.orContinue}</span>
                </div>

                {/* Guest */}
                <button className="guest-btn" onClick={handleGuestContinue}>
                    {t.guest}
                </button>

                {/* Privacy */}
                <p className="privacy-note">{t.privacyNote}</p>
            </div>

            <style jsx>{`
                .auth-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.2s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .auth-modal {
                    position: relative;
                    width: 100%;
                    max-width: 420px;
                    margin: 1rem;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 24px;
                    padding: 2rem;
                    box-shadow: var(--shadow-xl);
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .close-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    width: 32px;
                    height: 32px;
                    background: var(--bg-tertiary);
                    border: none;
                    border-radius: 50%;
                    font-size: 1.25rem;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .close-btn:hover {
                    background: var(--danger-bg);
                    color: var(--danger);
                }

                .auth-header {
                    text-align: center;
                    margin-bottom: 1.5rem;
                }

                .auth-logo {
                    width: 60px;
                    height: 60px;
                    margin: 0 auto 1rem;
                    background: var(--accent-gradient);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.75rem;
                    box-shadow: var(--accent-glow);
                }

                .auth-header h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
                }

                .auth-header p {
                    font-size: 0.9375rem;
                    color: var(--text-muted);
                }

                .role-selector {
                    margin-bottom: 1.5rem;
                }

                .role-label {
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    margin-bottom: 0.75rem;
                }

                .role-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                }

                .role-option {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 1rem;
                    background: var(--bg-tertiary);
                    border: 2px solid var(--border-color);
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: center;
                }

                .role-option:hover {
                    border-color: var(--accent-primary);
                }

                .role-option.active {
                    border-color: var(--accent-primary);
                    background: var(--accent-gradient-soft);
                }

                .role-icon {
                    font-size: 1.5rem;
                }

                .role-name {
                    font-size: 0.9375rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .role-desc {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.375rem;
                }

                .input-group label {
                    font-size: 0.8125rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                }

                .input-group input {
                    padding: 0.875rem 1rem;
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    font-size: 1rem;
                    color: var(--text-primary);
                    transition: all 0.2s;
                }

                .input-group input:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }

                .submit-btn {
                    padding: 1rem;
                    background: var(--accent-gradient);
                    color: white;
                    font-size: 1rem;
                    font-weight: 600;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: var(--accent-glow);
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                }

                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: wait;
                }

                .mode-toggle {
                    text-align: center;
                    margin-bottom: 1rem;
                }

                .mode-toggle p {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }

                .mode-toggle button {
                    background: none;
                    border: none;
                    color: var(--accent-primary);
                    font-weight: 600;
                    cursor: pointer;
                }

                .divider {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .divider::before,
                .divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: var(--border-color);
                }

                .divider span {
                    padding: 0 1rem;
                    font-size: 0.8125rem;
                    color: var(--text-muted);
                }

                .guest-btn {
                    width: 100%;
                    padding: 0.875rem;
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    font-size: 0.9375rem;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 1rem;
                }

                .guest-btn:hover {
                    background: var(--bg-hover);
                    border-color: var(--accent-primary);
                }

                .privacy-note {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-align: center;
                    line-height: 1.5;
                }
            `}</style>
        </div>
    );
}
