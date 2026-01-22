'use client';

import { useState } from 'react';

const translations = {
    uz: {
        locked: "Aloqa ma'lumotlari yashiringan",
        unlock: "Ochish uchun yollang",
        hire: "🔒 Yollash",
        hiring: "Jarayon...",
        unlocked: "Ma'lumotlar ochildi!",
        call: "📞 Qo'ng'iroq qilish",
        message: "💬 Xabar yozish",
        paymentNote: "To'lov amalga oshirilgandan keyin aloqa ochildi"
    },
    ru: {
        locked: "Контактные данные скрыты",
        unlock: "Наймите для разблокировки",
        hire: "🔒 Нанять",
        hiring: "Обработка...",
        unlocked: "Данные разблокированы!",
        call: "📞 Позвонить",
        message: "💬 Написать",
        paymentNote: "Контакты доступны после оплаты"
    }
};

export default function ContactProtection({
    lang = 'uz',
    phone,
    email,
    name,
    pricePerHour
}) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isHiring, setIsHiring] = useState(false);
    const t = translations[lang];

    // Blur the phone number
    const blurredPhone = phone
        ? phone.replace(/(\+\d{3})\s*(\d{2})\s*(\d{3})\s*(\d{2})\s*(\d{2})/, '$1 $2 ███ ██ ██')
        : '';

    const handleHire = async () => {
        setIsHiring(true);

        // Fake payment delay for demo
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsUnlocked(true);
        setIsHiring(false);
    };

    return (
        <div className={`contact-protection ${isUnlocked ? 'unlocked' : 'locked'}`}>
            {!isUnlocked ? (
                <>
                    <div className="lock-header">
                        <span className="lock-icon">🔒</span>
                        <div className="lock-info">
                            <h4>{t.locked}</h4>
                            <p>{t.unlock}</p>
                        </div>
                    </div>

                    <div className="blurred-contact">
                        <div className="blurred-row">
                            <span className="contact-icon">📞</span>
                            <span className="blurred-value">{blurredPhone}</span>
                        </div>
                        {email && (
                            <div className="blurred-row">
                                <span className="contact-icon">📧</span>
                                <span className="blurred-value">{email.replace(/(.{3})(.*)(@.*)/, '$1•••$3')}</span>
                            </div>
                        )}
                    </div>

                    <div className="hire-section">
                        <div className="price-info">
                            <span className="price-label">{lang === 'uz' ? 'Konsultatsiya narxi' : 'Стоимость консультации'}</span>
                            <span className="price-value">{pricePerHour?.toLocaleString()} UZS/soat</span>
                        </div>
                        <button
                            className="hire-btn-locked"
                            onClick={handleHire}
                            disabled={isHiring}
                        >
                            {isHiring ? t.hiring : t.hire}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="unlock-header">
                        <span className="unlock-icon">✅</span>
                        <h4>{t.unlocked}</h4>
                    </div>

                    <div className="revealed-contact">
                        <div className="contact-row">
                            <span className="contact-icon">📞</span>
                            <a href={`tel:${phone}`} className="contact-value">{phone}</a>
                        </div>
                        {email && (
                            <div className="contact-row">
                                <span className="contact-icon">📧</span>
                                <a href={`mailto:${email}`} className="contact-value">{email}</a>
                            </div>
                        )}
                    </div>

                    <div className="action-buttons">
                        <a href={`tel:${phone}`} className="action-btn call">
                            {t.call}
                        </a>
                        <a href={`https://t.me/+${phone?.replace(/\D/g, '')}`} className="action-btn message">
                            {t.message}
                        </a>
                    </div>

                    <p className="payment-note">{t.paymentNote}</p>
                </>
            )}

            <style jsx>{`
                .contact-protection {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    padding: 1.25rem;
                    transition: all 0.3s ease;
                }

                .contact-protection.locked {
                    background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
                }

                .contact-protection.unlocked {
                    border-color: var(--success);
                    background: linear-gradient(135deg, var(--success-bg) 0%, var(--bg-secondary) 100%);
                }

                /* Locked State */
                .lock-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }

                .lock-icon {
                    font-size: 1.5rem;
                }

                .lock-info h4 {
                    font-size: 0.9375rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 0;
                }

                .lock-info p {
                    font-size: 0.8125rem;
                    color: var(--text-muted);
                    margin: 0;
                }

                .blurred-contact {
                    margin-bottom: 1rem;
                    padding: 0.75rem;
                    background: var(--bg-tertiary);
                    border-radius: 12px;
                }

                .blurred-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.375rem 0;
                }

                .contact-icon {
                    font-size: 1rem;
                }

                .blurred-value {
                    font-size: 0.9375rem;
                    font-family: monospace;
                    color: var(--text-muted);
                    filter: blur(2px);
                    user-select: none;
                }

                .hire-section {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-light);
                }

                .price-info {
                    display: flex;
                    flex-direction: column;
                }

                .price-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .price-value {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .hire-btn-locked {
                    padding: 0.75rem 1.5rem;
                    background: var(--accent-gradient);
                    color: white;
                    font-size: 0.9375rem;
                    font-weight: 600;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: var(--accent-glow);
                }

                .hire-btn-locked:hover:not(:disabled) {
                    transform: translateY(-2px);
                }

                .hire-btn-locked:disabled {
                    opacity: 0.7;
                    cursor: wait;
                }

                /* Unlocked State */
                .unlock-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .unlock-icon {
                    font-size: 1.25rem;
                }

                .unlock-header h4 {
                    font-size: 0.9375rem;
                    font-weight: 600;
                    color: var(--success);
                    margin: 0;
                }

                .revealed-contact {
                    margin-bottom: 1rem;
                    padding: 0.75rem;
                    background: var(--bg-tertiary);
                    border-radius: 12px;
                }

                .contact-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.375rem 0;
                }

                .contact-value {
                    font-size: 0.9375rem;
                    font-weight: 500;
                    color: var(--accent-primary);
                    text-decoration: none;
                }

                .contact-value:hover {
                    text-decoration: underline;
                }

                .action-buttons {
                    display: flex;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }

                .action-btn {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 10px;
                    transition: all 0.2s;
                }

                .action-btn.call {
                    background: var(--success);
                    color: white;
                }

                .action-btn.message {
                    background: var(--info);
                    color: white;
                }

                .action-btn:hover {
                    transform: translateY(-2px);
                }

                .payment-note {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-align: center;
                    margin: 0;
                }
            `}</style>
        </div>
    );
}
