'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const translations = {
    uz: {
        title: "Jismoniy Shaxslar Uchun",
        subtitle: "Huquqlaringizni himoya qiling",
        back: "Orqaga",
        chooseFeature: "Qanday yordam kerak?",

        feature1Title: "Huquqiy Vaziyat Tahlili",
        feature1Subtitle: "Lex.uz asosida",
        feature1Desc: "Hayotiy vaziyatingizni tasvirlab bering - men sizning huquq va majburiyatlaringizni O'zbekiston qonunlari asosida tahlil qilaman.",
        feature1Examples: ["Ish beruvchi bilan nizolar", "Qo'shni bilan muammolar", "Oilaviy masalalar", "Iste'molchi huquqlari"],

        feature2Title: "Shartnoma Tekshiruvi",
        feature2Subtitle: "Shartlar himoyachisi",
        feature2Desc: "Ko'p odamlar o'qimay \"Roziman\" tugmasini bosishadi. Men shartnoma va maxfiylik siyosatlarini tahlil qilib, yashirin xavflarni topaman.",
        feature2Examples: ["Foydalanish shartlari", "Maxfiylik siyosati", "Ilova shartnomalarl", "Onlayn xizmatlar"],

        start: "Boshlash",
        langUz: "O'zbek",
        langRu: "Русский"
    },
    ru: {
        title: "Для Физических Лиц",
        subtitle: "Защитите свои права",
        back: "Назад",
        chooseFeature: "Какая помощь нужна?",

        feature1Title: "Анализ Правовой Ситуации",
        feature1Subtitle: "На основе Lex.uz",
        feature1Desc: "Опишите вашу жизненную ситуацию - я проанализирую ваши права и обязанности на основе законов Узбекистана.",
        feature1Examples: ["Споры с работодателем", "Проблемы с соседями", "Семейные вопросы", "Права потребителей"],

        feature2Title: "Проверка Договоров",
        feature2Subtitle: "Защитник условий",
        feature2Desc: "Многие нажимают \"Согласен\" не читая. Я анализирую договоры и политики конфиденциальности, находя скрытые риски.",
        feature2Examples: ["Условия использования", "Политика конфиденциальности", "Договоры приложений", "Онлайн-сервисы"],

        start: "Начать",
        langUz: "O'zbek",
        langRu: "Русский"
    }
};

function IndividualContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const lang = searchParams.get('lang') || 'uz';
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [hoverFeature, setHoverFeature] = useState(null);
    const t = translations[lang];

    const handleContinue = () => {
        if (selectedFeature) {
            router.push(`/chat?lang=${lang}&mode=${selectedFeature}`);
        }
    };

    return (
        <div className="landing-container" style={{ background: 'var(--bg-primary)' }}>
            <main className="hero" style={{ maxWidth: 1100 }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: '2rem'
                }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => router.push('/')}
                    >
                        ← {t.back}
                    </button>

                    <div className="language-selector" style={{ marginBottom: 0 }}>
                        <button
                            className={`lang-btn ${lang === 'uz' ? 'active' : ''}`}
                            onClick={() => router.push(`/individual?lang=uz`)}
                        >
                            🇺🇿
                        </button>
                        <button
                            className={`lang-btn ${lang === 'ru' ? 'active' : ''}`}
                            onClick={() => router.push(`/individual?lang=ru`)}
                        >
                            🇷🇺
                        </button>
                    </div>
                </div>

                {/* Icon & Title */}
                <div style={{
                    width: 80,
                    height: 80,
                    background: 'var(--accent-gradient)',
                    borderRadius: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: 'var(--accent-glow)'
                }}>
                    👤
                </div>
                <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>{t.title}</h1>
                <p className="hero-subtitle" style={{ marginBottom: '2.5rem' }}>{t.subtitle}</p>

                {/* Choose Feature */}
                <h2 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '2rem'
                }}>
                    {t.chooseFeature}
                </h2>

                {/* Feature Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '1.5rem',
                    width: '100%',
                    maxWidth: 900,
                    marginBottom: '2rem'
                }}>
                    {/* Feature 1: Legal Analysis */}
                    <div
                        className="card"
                        onClick={() => setSelectedFeature('legal')}
                        onMouseEnter={() => setHoverFeature('legal')}
                        onMouseLeave={() => setHoverFeature(null)}
                        style={{
                            padding: '2rem',
                            cursor: 'pointer',
                            border: selectedFeature === 'legal'
                                ? '2px solid var(--accent-primary)'
                                : '2px solid var(--border-color)',
                            background: selectedFeature === 'legal'
                                ? 'var(--accent-gradient-soft)'
                                : 'var(--bg-secondary)',
                            transform: hoverFeature === 'legal' || selectedFeature === 'legal' ? 'translateY(-4px)' : 'none',
                            boxShadow: selectedFeature === 'legal'
                                ? 'var(--accent-glow)'
                                : hoverFeature === 'legal'
                                    ? 'var(--shadow-lg)'
                                    : 'var(--shadow-card)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                width: 56,
                                height: 56,
                                background: selectedFeature === 'legal' ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
                                borderRadius: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.75rem',
                                transition: 'all 0.3s ease',
                                color: selectedFeature === 'legal' ? 'white' : 'inherit'
                            }}>
                                ⚖️
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.125rem' }}>{t.feature1Title}</h3>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: 'var(--accent-primary)',
                                    background: 'var(--accent-gradient-soft)',
                                    padding: '0.125rem 0.5rem',
                                    borderRadius: '1rem'
                                }}>
                                    {t.feature1Subtitle}
                                </span>
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                            {t.feature1Desc}
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                        }}>
                            {t.feature1Examples.map((example, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        fontSize: '0.8125rem',
                                        padding: '0.375rem 0.75rem',
                                        background: 'var(--bg-tertiary)',
                                        borderRadius: '2rem',
                                        color: 'var(--text-secondary)'
                                    }}
                                >
                                    {example}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Feature 2: ToS Analysis */}
                    <div
                        className="card"
                        onClick={() => setSelectedFeature('tos')}
                        onMouseEnter={() => setHoverFeature('tos')}
                        onMouseLeave={() => setHoverFeature(null)}
                        style={{
                            padding: '2rem',
                            cursor: 'pointer',
                            border: selectedFeature === 'tos'
                                ? '2px solid var(--accent-primary)'
                                : '2px solid var(--border-color)',
                            background: selectedFeature === 'tos'
                                ? 'var(--accent-gradient-soft)'
                                : 'var(--bg-secondary)',
                            transform: hoverFeature === 'tos' || selectedFeature === 'tos' ? 'translateY(-4px)' : 'none',
                            boxShadow: selectedFeature === 'tos'
                                ? 'var(--accent-glow)'
                                : hoverFeature === 'tos'
                                    ? 'var(--shadow-lg)'
                                    : 'var(--shadow-card)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                width: 56,
                                height: 56,
                                background: selectedFeature === 'tos' ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
                                borderRadius: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.75rem',
                                transition: 'all 0.3s ease',
                                color: selectedFeature === 'tos' ? 'white' : 'inherit'
                            }}>
                                🛡️
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.125rem' }}>{t.feature2Title}</h3>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: 'var(--warning)',
                                    background: 'var(--warning-bg)',
                                    padding: '0.125rem 0.5rem',
                                    borderRadius: '1rem'
                                }}>
                                    {t.feature2Subtitle}
                                </span>
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                            {t.feature2Desc}
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                        }}>
                            {t.feature2Examples.map((example, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        fontSize: '0.8125rem',
                                        padding: '0.375rem 0.75rem',
                                        background: 'var(--bg-tertiary)',
                                        borderRadius: '2rem',
                                        color: 'var(--text-secondary)'
                                    }}
                                >
                                    {example}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Continue Button */}
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleContinue}
                    disabled={!selectedFeature}
                    style={{
                        opacity: selectedFeature ? 1 : 0.5,
                        cursor: selectedFeature ? 'pointer' : 'not-allowed',
                        minWidth: 200
                    }}
                >
                    {t.start} →
                </button>

                {/* Disclaimer */}
                <p className="disclaimer" style={{ maxWidth: 500 }}>
                    {lang === 'uz'
                        ? "Advo AI yuridik maslahatchi emas. Jiddiy holatlarda advokatga murojaat qiling."
                        : "Advo AI не является юридическим консультантом. В серьезных случаях обратитесь к адвокату."
                    }
                </p>
            </main>
        </div>
    );
}

export default function IndividualPage() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        }>
            <IndividualContent />
        </Suspense>
    );
}
