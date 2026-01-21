'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import lawyersData from '@/data/lawyers.json';

const translations = {
    uz: {
        title: "Mutaxassislar",
        subtitle: "Malakali yurist va buxgalterlarni toping",
        search: "Qidirish...",
        all: "Barchasi",
        filters: {
            type: "Tur",
            specialty: "Ixtisoslik",
            city: "Shahar"
        },
        hire: "Bog'lanish",
        experience: "yil tajriba",
        reviews: "sharh",
        perHour: "/soat",
        verified: "Tasdiqlangan",
        noResults: "Hech narsa topilmadi",
        registerCta: "Siz ham mutaxassismisiz?",
        registerBtn: "Ro'yxatdan o'ting"
    },
    ru: {
        title: "Специалисты",
        subtitle: "Найдите квалифицированных юристов и бухгалтеров",
        search: "Поиск...",
        all: "Все",
        filters: {
            type: "Тип",
            specialty: "Специализация",
            city: "Город"
        },
        hire: "Связаться",
        experience: "лет опыта",
        reviews: "отзывов",
        perHour: "/час",
        verified: "Проверен",
        noResults: "Ничего не найдено",
        registerCta: "Вы тоже специалист?",
        registerBtn: "Зарегистрируйтесь"
    }
};

function MarketplaceContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const lang = searchParams.get('lang') || 'uz';
    const t = translations[lang];

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [cityFilter, setCityFilter] = useState('all');

    const partners = lawyersData.partners;
    const specializations = lawyersData.specializations;
    const cities = lawyersData.cities;
    const partnerTypes = lawyersData.partner_types;

    // Filter partners
    const filteredPartners = partners.filter(partner => {
        const matchesSearch = partner.name.toLowerCase().includes(search.toLowerCase()) ||
            partner.bio_uz?.toLowerCase().includes(search.toLowerCase()) ||
            partner.bio_ru?.toLowerCase().includes(search.toLowerCase());

        const matchesType = typeFilter === 'all' || partner.type === typeFilter;
        const matchesSpecialty = specialtyFilter === 'all' || partner.specializations.includes(specialtyFilter);
        const matchesCity = cityFilter === 'all' || partner.city.toLowerCase().includes(cityFilter.toLowerCase());

        return matchesSearch && matchesType && matchesSpecialty && matchesCity;
    });

    return (
        <div className="marketplace-container">
            <Navbar lang={lang} />

            <main className="marketplace-main">
                {/* Header */}
                <div className="marketplace-header">
                    <h1>{t.title}</h1>
                    <p>{t.subtitle}</p>
                </div>

                {/* Filters */}
                <div className="filters-bar">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder={t.search}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">{t.filters.type}: {t.all}</option>
                        {Object.entries(partnerTypes).map(([key, value]) => (
                            <option key={key} value={key}>{value[lang]}</option>
                        ))}
                    </select>

                    <select
                        value={specialtyFilter}
                        onChange={(e) => setSpecialtyFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">{t.filters.specialty}: {t.all}</option>
                        {Object.entries(specializations).map(([key, value]) => (
                            <option key={key} value={key}>{value[lang]}</option>
                        ))}
                    </select>

                    <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">{t.filters.city}: {t.all}</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city[lang]}>{city[lang]}</option>
                        ))}
                    </select>
                </div>

                {/* Results */}
                <div className="partners-grid">
                    {filteredPartners.length > 0 ? (
                        filteredPartners.map((partner) => (
                            <div
                                key={partner.id}
                                className="partner-card"
                                onClick={() => router.push(`/marketplace/${partner.id}?lang=${lang}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="partner-header">
                                    <div className="partner-avatar">
                                        👤
                                    </div>
                                    <div className="partner-info">
                                        <h3>{partner.name}</h3>
                                        <div className="partner-meta">
                                            <span className="rating">⭐ {partner.rating}</span>
                                            <span className="reviews">({partner.reviews_count} {t.reviews})</span>
                                        </div>
                                    </div>
                                    {partner.verified && (
                                        <span className="verified-badge">✓ {t.verified}</span>
                                    )}
                                </div>

                                <div className="partner-type">
                                    {partnerTypes[partner.type]?.[lang]}
                                </div>

                                <div className="partner-tags">
                                    {partner.specializations.map((spec) => (
                                        <span key={spec} className="tag">
                                            {specializations[spec]?.[lang] || spec}
                                        </span>
                                    ))}
                                </div>

                                <div className="partner-details">
                                    <span>📍 {partner.city}</span>
                                    <span>📅 {partner.experience_years} {t.experience}</span>
                                </div>

                                <p className="partner-bio">
                                    {lang === 'uz' ? partner.bio_uz : partner.bio_ru}
                                </p>

                                <div className="partner-footer">
                                    <div className="price">
                                        💰 {partner.price_per_hour?.toLocaleString()} UZS{t.perHour}
                                    </div>
                                    <a
                                        href={`tel:${partner.phone}`}
                                        className="hire-btn"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        📞 {t.hire}
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <span>😕</span>
                            <p>{t.noResults}</p>
                        </div>
                    )}
                </div>

                {/* CTA for partners */}
                <div className="register-cta">
                    <p>{t.registerCta}</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => router.push('/partners/register?lang=' + lang)}
                    >
                        🤝 {t.registerBtn}
                    </button>
                </div>
            </main>

            <style jsx>{`
                .marketplace-container {
                    min-height: 100vh;
                    background: linear-gradient(180deg, #fafbfc 0%, #f0f4ff 50%, #fafbfc 100%);
                }

                .marketplace-main {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: calc(64px + 2rem) 1.5rem 3rem;
                }

                .marketplace-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .marketplace-header h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    background: var(--accent-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 0.5rem;
                }

                .marketplace-header p {
                    color: var(--text-secondary);
                    font-size: 1.125rem;
                }

                .filters-bar {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    background: white;
                    border-radius: 16px;
                    box-shadow: var(--shadow-md);
                }

                .search-box {
                    flex: 1;
                    min-width: 200px;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    background: var(--bg-tertiary);
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                }

                .search-box input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    font-size: 0.9375rem;
                    outline: none;
                }

                .filter-select {
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    background: white;
                    cursor: pointer;
                    min-width: 150px;
                }

                .partners-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 1.5rem;
                }

                .partner-card {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: var(--shadow-card);
                    border: 1px solid var(--border-color);
                    transition: all 0.3s ease;
                }

                .partner-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg);
                }

                .partner-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .partner-avatar {
                    width: 60px;
                    height: 60px;
                    background: var(--accent-gradient-soft);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.75rem;
                }

                .partner-info {
                    flex: 1;
                }

                .partner-info h3 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }

                .partner-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                }

                .rating {
                    color: var(--warning);
                    font-weight: 600;
                }

                .reviews {
                    color: var(--text-muted);
                }

                .verified-badge {
                    padding: 0.25rem 0.5rem;
                    background: var(--success-bg);
                    color: var(--success);
                    font-size: 0.75rem;
                    font-weight: 600;
                    border-radius: 6px;
                }

                .partner-type {
                    display: inline-block;
                    padding: 0.375rem 0.75rem;
                    background: var(--accent-gradient-soft);
                    color: var(--accent-primary);
                    font-size: 0.8125rem;
                    font-weight: 600;
                    border-radius: 8px;
                    margin-bottom: 0.75rem;
                }

                .partner-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                }

                .tag {
                    padding: 0.25rem 0.625rem;
                    background: var(--bg-tertiary);
                    color: var(--text-secondary);
                    font-size: 0.75rem;
                    border-radius: 6px;
                }

                .partner-details {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    margin-bottom: 0.75rem;
                }

                .partner-bio {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                    margin-bottom: 1rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .partner-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-light);
                }

                .price {
                    font-size: 0.9375rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .hire-btn {
                    padding: 0.625rem 1.25rem;
                    background: var(--accent-gradient);
                    color: white;
                    font-size: 0.875rem;
                    font-weight: 600;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: var(--accent-glow);
                }

                .hire-btn:hover {
                    transform: translateY(-2px);
                }

                .no-results {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 3rem;
                }

                .no-results span {
                    font-size: 3rem;
                }

                .no-results p {
                    color: var(--text-muted);
                    margin-top: 1rem;
                }

                .register-cta {
                    text-align: center;
                    margin-top: 3rem;
                    padding: 2rem;
                    background: var(--accent-gradient-soft);
                    border-radius: 20px;
                }

                .register-cta p {
                    color: var(--text-secondary);
                    margin-bottom: 1rem;
                }

                @media (max-width: 768px) {
                    .partners-grid {
                        grid-template-columns: 1fr;
                    }

                    .filters-bar {
                        flex-direction: column;
                    }

                    .filter-select {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}

export default function MarketplacePage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loading-dots"><span></span><span></span><span></span></div>
            </div>
        }>
            <MarketplaceContent />
        </Suspense>
    );
}
