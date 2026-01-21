'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import lawyersData from '@/data/lawyers.json';

const translations = {
    uz: {
        back: "← Orqaga",
        experience: "yil tajriba",
        reviews: "sharh",
        consultations: "konsultatsiya",
        perHour: "/soat",
        verified: "Tasdiqlangan mutaxassis",
        about: "Haqida",
        specializations: "Ixtisosliklar",
        contact: "Bog'lanish",
        phone: "Telefon",
        email: "Email",
        languages: "Tillar",
        hire: "Bog'lanish",
        notFound: "Mutaxassis topilmadi"
    },
    ru: {
        back: "← Назад",
        experience: "лет опыта",
        reviews: "отзывов",
        consultations: "консультаций",
        perHour: "/час",
        verified: "Проверенный специалист",
        about: "О себе",
        specializations: "Специализации",
        contact: "Контакты",
        phone: "Телефон",
        email: "Email",
        languages: "Языки",
        hire: "Связаться",
        notFound: "Специалист не найден"
    }
};

const langNames = {
    uz: { uz: "O'zbek", ru: "Узбекский", en: "Uzbek" },
    ru: { uz: "Rus", ru: "Русский", en: "Russian" },
    en: { uz: "Ingliz", ru: "Английский", en: "English" }
};

function PartnerProfileContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const lang = searchParams.get('lang') || 'uz';
    const t = translations[lang];

    const partner = lawyersData.partners.find(p => p.id === params.id);
    const specializations = lawyersData.specializations;
    const partnerTypes = lawyersData.partner_types;

    if (!partner) {
        return (
            <div className="profile-container">
                <Navbar lang={lang} />
                <div className="not-found">
                    <span>😕</span>
                    <p>{t.notFound}</p>
                    <button onClick={() => router.push('/marketplace?lang=' + lang)}>
                        {t.back}
                    </button>
                </div>
                <style jsx>{`
                    .profile-container {
                        min-height: 100vh;
                        background: linear-gradient(180deg, #fafbfc 0%, #f0f4ff 100%);
                    }
                    .not-found {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: calc(100vh - 64px);
                        text-align: center;
                    }
                    .not-found span { font-size: 4rem; }
                    .not-found p { font-size: 1.25rem; color: var(--text-secondary); margin: 1rem 0; }
                    .not-found button {
                        padding: 0.75rem 1.5rem;
                        background: var(--accent-gradient);
                        color: white;
                        border: none;
                        border-radius: 10px;
                        cursor: pointer;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <Navbar lang={lang} />

            <main className="profile-main">
                {/* Back button */}
                <button
                    className="back-btn"
                    onClick={() => router.push('/marketplace?lang=' + lang)}
                >
                    {t.back}
                </button>

                {/* Profile Card */}
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="avatar-large">👤</div>
                        <div className="profile-info">
                            <h1>{partner.name}</h1>
                            <div className="type-badge">
                                {partnerTypes[partner.type]?.[lang]}
                            </div>
                            <div className="meta-row">
                                <span className="rating">⭐ {partner.rating}</span>
                                <span>({partner.reviews_count} {t.reviews})</span>
                                <span>•</span>
                                <span>{partner.consultations} {t.consultations}</span>
                            </div>
                            {partner.verified && (
                                <div className="verified">✓ {t.verified}</div>
                            )}
                        </div>
                    </div>

                    <div className="profile-body">
                        {/* Stats */}
                        <div className="stats-row">
                            <div className="stat">
                                <span className="stat-value">📍</span>
                                <span className="stat-label">{partner.city}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">📅</span>
                                <span className="stat-label">{partner.experience_years} {t.experience}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">💰</span>
                                <span className="stat-label">{partner.price_per_hour?.toLocaleString()} UZS{t.perHour}</span>
                            </div>
                        </div>

                        {/* About */}
                        <div className="section">
                            <h3>{t.about}</h3>
                            <p>{lang === 'uz' ? partner.bio_uz : partner.bio_ru}</p>
                        </div>

                        {/* Specializations */}
                        <div className="section">
                            <h3>{t.specializations}</h3>
                            <div className="tags">
                                {partner.specializations.map(spec => (
                                    <span key={spec} className="tag">
                                        {specializations[spec]?.[lang] || spec}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="section">
                            <h3>{t.languages}</h3>
                            <div className="tags">
                                {partner.languages?.map(l => (
                                    <span key={l} className="tag lang">
                                        {langNames[l]?.[lang] || l}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="section contact-section">
                            <h3>{t.contact}</h3>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <span className="label">{t.phone}:</span>
                                    <a href={`tel:${partner.phone}`}>{partner.phone}</a>
                                </div>
                                {partner.email && (
                                    <div className="contact-item">
                                        <span className="label">{t.email}:</span>
                                        <a href={`mailto:${partner.email}`}>{partner.email}</a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA */}
                        <a href={`tel:${partner.phone}`} className="hire-btn-large">
                            📞 {t.hire}
                        </a>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .profile-container {
                    min-height: 100vh;
                    background: linear-gradient(180deg, #fafbfc 0%, #f0f4ff 100%);
                }

                .profile-main {
                    max-width: 700px;
                    margin: 0 auto;
                    padding: calc(64px + 2rem) 1.5rem 3rem;
                }

                .back-btn {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.5rem 1rem;
                    font-size: 0.9375rem;
                    color: var(--text-secondary);
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    margin-bottom: 1rem;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .back-btn:hover {
                    color: var(--accent-primary);
                    background: var(--accent-gradient-soft);
                }

                .profile-card {
                    background: white;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: var(--shadow-xl);
                    border: 1px solid var(--border-color);
                }

                .profile-header {
                    display: flex;
                    gap: 1.5rem;
                    padding: 2rem;
                    background: var(--accent-gradient-soft);
                    border-bottom: 1px solid var(--border-light);
                }

                .avatar-large {
                    width: 100px;
                    height: 100px;
                    background: white;
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    box-shadow: var(--shadow-md);
                }

                .profile-info {
                    flex: 1;
                }

                .profile-info h1 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }

                .type-badge {
                    display: inline-block;
                    padding: 0.375rem 0.75rem;
                    background: var(--accent-gradient);
                    color: white;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    border-radius: 8px;
                    margin-bottom: 0.5rem;
                }

                .meta-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    margin-bottom: 0.5rem;
                }

                .rating {
                    color: var(--warning);
                    font-weight: 600;
                }

                .verified {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    background: var(--success-bg);
                    color: var(--success);
                    font-size: 0.75rem;
                    font-weight: 600;
                    border-radius: 6px;
                }

                .profile-body {
                    padding: 2rem;
                }

                .stats-row {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid var(--border-light);
                }

                .stat {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .stat-value {
                    font-size: 1.25rem;
                }

                .stat-label {
                    font-size: 0.9375rem;
                    color: var(--text-secondary);
                }

                .section {
                    margin-bottom: 1.5rem;
                }

                .section h3 {
                    font-size: 0.9375rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    margin-bottom: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .section p {
                    font-size: 1rem;
                    line-height: 1.7;
                    color: var(--text-primary);
                }

                .tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .tag {
                    padding: 0.5rem 1rem;
                    background: var(--bg-tertiary);
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    border-radius: 8px;
                }

                .tag.lang {
                    background: var(--accent-gradient-soft);
                    color: var(--accent-primary);
                }

                .contact-section {
                    padding: 1.5rem;
                    background: var(--bg-tertiary);
                    border-radius: 16px;
                    margin-bottom: 1.5rem;
                }

                .contact-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .contact-item .label {
                    color: var(--text-muted);
                    font-size: 0.875rem;
                }

                .contact-item a {
                    color: var(--accent-primary);
                    font-weight: 600;
                    text-decoration: none;
                }

                .hire-btn-large {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    width: 100%;
                    padding: 1.25rem;
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: white;
                    background: var(--accent-gradient);
                    border: none;
                    border-radius: 16px;
                    cursor: pointer;
                    text-decoration: none;
                    box-shadow: var(--accent-glow);
                    transition: all 0.2s;
                }

                .hire-btn-large:hover {
                    transform: translateY(-2px);
                }

                @media (max-width: 640px) {
                    .profile-header {
                        flex-direction: column;
                        text-align: center;
                        align-items: center;
                    }

                    .stats-row {
                        flex-direction: column;
                        gap: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default function PartnerProfilePage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loading-dots"><span></span><span></span><span></span></div>
            </div>
        }>
            <PartnerProfileContent />
        </Suspense>
    );
}
