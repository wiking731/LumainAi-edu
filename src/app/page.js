'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const translations = {
  uz: {
    title: "Advo AI",
    subtitle: "O'zbekistonning eng ilg'or raqamli huquqiy advokati",
    chooseType: "Kim sifatida davom etasiz?",
    individual: "Jismoniy Shaxs",
    individualDesc: "Fuqarolar, iste'molchilar, xodimlar uchun huquqiy yordam",
    individualFeatures: ["Mehnat huquqi masalalari", "Iste'molchi huquqlari", "Shartnomalar tahlili", "Oilaviy masalalar"],
    business: "Yuridik Shaxs",
    businessDesc: "Korxonalar, tadbirkorlar uchun huquqiy xizmatlar",
    businessFeatures: ["Biznes shartnomalar", "Soliq masalalari", "Litsenziyalash", "Xodimlar bilan munosabat"],
    comingSoon: "Tez kunda",
    start: "Boshlash",
    langUz: "O'zbek",
    langRu: "Русский"
  },
  ru: {
    title: "Advo AI",
    subtitle: "Самый передовой цифровой юридический адвокат Узбекистана",
    chooseType: "Кем вы продолжите?",
    individual: "Физическое Лицо",
    individualDesc: "Юридическая помощь для граждан, потребителей, работников",
    individualFeatures: ["Трудовое право", "Права потребителей", "Анализ договоров", "Семейные вопросы"],
    business: "Юридическое Лицо",
    businessDesc: "Юридические услуги для компаний и предпринимателей",
    businessFeatures: ["Бизнес-контракты", "Налоговые вопросы", "Лицензирование", "Трудовые отношения"],
    comingSoon: "Скоро",
    start: "Начать",
    langUz: "O'zbek",
    langRu: "Русский"
  }
};

export default function Home() {
  const [lang, setLang] = useState('uz');
  const [selectedType, setSelectedType] = useState(null);
  const [hoverType, setHoverType] = useState(null);
  const router = useRouter();
  const t = translations[lang];

  const handleContinue = () => {
    if (selectedType === 'individual') {
      router.push(`/individual?lang=${lang}`);
    }
  };

  return (
    <div className="landing-container" style={{ background: 'linear-gradient(180deg, #fafbfc 0%, #f0f4ff 50%, #fafbfc 100%)' }}>
      <main className="hero" style={{ maxWidth: 1100 }}>
        {/* Language Selector */}
        <div className="language-selector" style={{ marginBottom: '2rem' }}>
          <button
            className={`lang-btn ${lang === 'uz' ? 'active' : ''}`}
            onClick={() => setLang('uz')}
          >
            🇺🇿 {t.langUz}
          </button>
          <button
            className={`lang-btn ${lang === 'ru' ? 'active' : ''}`}
            onClick={() => setLang('ru')}
          >
            🇷🇺 {t.langRu}
          </button>
        </div>

        {/* Logo & Title */}
        <div className="hero-logo">⚖️</div>
        <h1 className="hero-title">{t.title}</h1>
        <p className="hero-subtitle" style={{ marginBottom: '3rem' }}>{t.subtitle}</p>

        {/* Choose Type */}
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          marginBottom: '2rem'
        }}>
          {t.chooseType}
        </h2>

        {/* Selection Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          width: '100%',
          maxWidth: 800,
          marginBottom: '2rem'
        }}>
          {/* Individual Card */}
          <div
            className={`card ${selectedType === 'individual' ? 'card-selected' : ''}`}
            onClick={() => setSelectedType('individual')}
            onMouseEnter={() => setHoverType('individual')}
            onMouseLeave={() => setHoverType(null)}
            style={{
              padding: '2rem',
              cursor: 'pointer',
              border: selectedType === 'individual'
                ? '2px solid var(--accent-primary)'
                : '2px solid var(--border-color)',
              background: selectedType === 'individual'
                ? 'var(--accent-gradient-soft)'
                : 'var(--bg-secondary)',
              transform: hoverType === 'individual' || selectedType === 'individual' ? 'translateY(-4px)' : 'none',
              boxShadow: selectedType === 'individual'
                ? 'var(--accent-glow)'
                : hoverType === 'individual'
                  ? 'var(--shadow-lg)'
                  : 'var(--shadow-card)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              width: 64,
              height: 64,
              background: selectedType === 'individual' ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: '1rem',
              transition: 'all 0.3s ease'
            }}>
              👤
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t.individual}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t.individualDesc}</p>
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.9375rem',
              color: 'var(--text-secondary)'
            }}>
              {t.individualFeatures.map((feature, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--success)' }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Business Card (Coming Soon) */}
          <div
            className="card"
            style={{
              padding: '2rem',
              cursor: 'not-allowed',
              opacity: 0.6,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Coming Soon Badge */}
            <div style={{
              position: 'absolute',
              top: 20,
              right: -35,
              background: 'var(--accent-gradient)',
              color: 'white',
              padding: '0.25rem 2.5rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              transform: 'rotate(45deg)',
              textTransform: 'uppercase'
            }}>
              {t.comingSoon}
            </div>

            <div style={{
              width: 64,
              height: 64,
              background: 'var(--bg-tertiary)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: '1rem'
            }}>
              🏢
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t.business}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t.businessDesc}</p>
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.9375rem',
              color: 'var(--text-muted)'
            }}>
              {t.businessFeatures.map((feature, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>○</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Continue Button */}
        <button
          className="btn btn-primary btn-lg"
          onClick={handleContinue}
          disabled={!selectedType}
          style={{
            opacity: selectedType ? 1 : 0.5,
            cursor: selectedType ? 'pointer' : 'not-allowed',
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
