'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const translations = {
    uz: {
        title: "Hamkorlik Dasturi",
        subtitle: "Yurist yoki buxgalter sifatida ro'yxatdan o'ting",
        form: {
            name: "To'liq ism",
            namePlaceholder: "Aliyev Sherzod Karimovich",
            type: "Mutaxassislik turi",
            types: {
                lawyer: "Yurist",
                accountant: "Buxgalter",
                tax_consultant: "Soliq maslahatchi"
            },
            specializations: "Ixtisoslik (bir nechta tanlang)",
            specs: {
                tax: "Soliq",
                business: "Biznes",
                contract: "Shartnoma",
                criminal: "Jinoyat",
                civil: "Fuqarolik",
                family: "Oilaviy",
                labor: "Mehnat",
                property: "Mulk",
                accounting: "Buxgalteriya",
                audit: "Audit"
            },
            experience: "Tajriba yillari",
            city: "Shahar",
            cities: ["Toshkent", "Samarqand", "Buxoro", "Farg'ona", "Andijon", "Namangan", "Xorazm", "Qoraqalpog'iston"],
            phone: "Telefon raqam",
            phonePlaceholder: "+998 90 123 45 67",
            email: "Email",
            emailPlaceholder: "email@example.com",
            bio: "O'zingiz haqingizda",
            bioPlaceholder: "Tajribangiz, yutuqlaringiz va ixtisosligingiz haqida yozing...",
            terms: "Foydalanish shartlariga roziman",
            submit: "Ro'yxatdan o'tish",
            success: "Muvaffaqiyatli ro'yxatdan o'tdingiz! Tez orada siz bilan bog'lanamiz.",
            already: "Allaqachon ro'yxatdan o'tganmisiz?",
            login: "Kirish"
        }
    },
    ru: {
        title: "Партнёрская Программа",
        subtitle: "Зарегистрируйтесь как юрист или бухгалтер",
        form: {
            name: "Полное имя",
            namePlaceholder: "Алиев Шерзод Каримович",
            type: "Тип специалиста",
            types: {
                lawyer: "Юрист",
                accountant: "Бухгалтер",
                tax_consultant: "Налоговый консультант"
            },
            specializations: "Специализация (можно несколько)",
            specs: {
                tax: "Налоги",
                business: "Бизнес",
                contract: "Договоры",
                criminal: "Уголовное",
                civil: "Гражданское",
                family: "Семейное",
                labor: "Трудовое",
                property: "Имущество",
                accounting: "Бухгалтерия",
                audit: "Аудит"
            },
            experience: "Лет опыта",
            city: "Город",
            cities: ["Ташкент", "Самарканд", "Бухара", "Фергана", "Андижан", "Наманган", "Хорезм", "Каракалпакстан"],
            phone: "Телефон",
            phonePlaceholder: "+998 90 123 45 67",
            email: "Email",
            emailPlaceholder: "email@example.com",
            bio: "О себе",
            bioPlaceholder: "Расскажите о вашем опыте, достижениях и специализации...",
            terms: "Согласен с условиями использования",
            submit: "Зарегистрироваться",
            success: "Регистрация успешна! Мы скоро свяжемся с вами.",
            already: "Уже зарегистрированы?",
            login: "Войти"
        }
    }
};

function RegisterContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const lang = searchParams.get('lang') || 'uz';
    const t = translations[lang];

    const [formData, setFormData] = useState({
        name: '',
        type: 'lawyer',
        specializations: [],
        experience_years: '',
        city: '',
        phone: '',
        email: '',
        bio: '',
        terms: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSpecChange = (spec) => {
        setFormData(prev => ({
            ...prev,
            specializations: prev.specializations.includes(spec)
                ? prev.specializations.filter(s => s !== spec)
                : [...prev.specializations, spec]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setShowSuccess(true);
        setIsSubmitting(false);
    };

    if (showSuccess) {
        return (
            <div className="register-container">
                <Navbar lang={lang} />
                <div className="success-screen">
                    <div className="success-icon">✅</div>
                    <h2>{t.form.success}</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => router.push('/marketplace?lang=' + lang)}
                    >
                        {lang === 'uz' ? "Katalogga o'tish" : "Перейти в каталог"}
                    </button>
                </div>
                <style jsx>{`
                    .register-container {
                        min-height: 100vh;
                        background: var(--bg-primary);
                    }
                    .success-screen {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: calc(100vh - 64px);
                        padding: 2rem;
                        text-align: center;
                    }
                    .success-icon {
                        font-size: 5rem;
                        margin-bottom: 1.5rem;
                    }
                    .success-screen h2 {
                        font-size: 1.5rem;
                        color: var(--text-primary);
                        margin-bottom: 2rem;
                        max-width: 400px;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="register-container">
            <Navbar lang={lang} />

            <main className="register-main">
                <div className="register-card">
                    <div className="register-header">
                        <span className="header-icon">🤝</span>
                        <h1>{t.title}</h1>
                        <p>{t.subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        {/* Name */}
                        <div className="form-group">
                            <label>👤 {t.form.name} *</label>
                            <input
                                type="text"
                                placeholder={t.form.namePlaceholder}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Type */}
                        <div className="form-group">
                            <label>📋 {t.form.type} *</label>
                            <div className="type-options">
                                {Object.entries(t.form.types).map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`type-btn ${formData.type === key ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, type: key })}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Specializations */}
                        <div className="form-group">
                            <label>🏷️ {t.form.specializations} *</label>
                            <div className="specs-grid">
                                {Object.entries(t.form.specs).map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`spec-btn ${formData.specializations.includes(key) ? 'active' : ''}`}
                                        onClick={() => handleSpecChange(key)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Experience & City */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>📅 {t.form.experience} *</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="50"
                                    placeholder="5"
                                    value={formData.experience_years}
                                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>📍 {t.form.city} *</label>
                                <select
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    required
                                >
                                    <option value="">--</option>
                                    {t.form.cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Phone & Email */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>📞 {t.form.phone} *</label>
                                <input
                                    type="tel"
                                    placeholder={t.form.phonePlaceholder}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>📧 {t.form.email}</label>
                                <input
                                    type="email"
                                    placeholder={t.form.emailPlaceholder}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="form-group">
                            <label>📝 {t.form.bio}</label>
                            <textarea
                                rows={4}
                                placeholder={t.form.bioPlaceholder}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            />
                        </div>

                        {/* Terms */}
                        <div className="form-group terms">
                            <label className="terms-label">
                                <input
                                    type="checkbox"
                                    checked={formData.terms}
                                    onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                                    required
                                />
                                <span>{t.form.terms}</span>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '...' : t.form.submit}
                        </button>
                    </form>

                    <div className="login-link">
                        {t.form.already} <a href="#">{t.form.login}</a>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .register-container {
                    min-height: 100vh;
                    background: var(--bg-primary);
                }

                .register-main {
                    max-width: 640px;
                    margin: 0 auto;
                    padding: calc(64px + 2rem) 1.5rem 3rem;
                }

                .register-card {
                    background: var(--bg-secondary);
                    border-radius: 24px;
                    padding: 2.5rem;
                    box-shadow: var(--shadow-xl);
                    border: 1px solid var(--border-color);
                }

                .register-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .header-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 72px;
                    height: 72px;
                    font-size: 2.5rem;
                    background: var(--accent-gradient-soft);
                    border-radius: 20px;
                    margin-bottom: 1rem;
                }

                .register-header h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }

                .register-header p {
                    color: var(--text-secondary);
                }

                .register-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .form-group input,
                .form-group select,
                .form-group textarea {
                    padding: 0.875rem 1rem;
                    font-size: 1rem;
                    border: 2px solid var(--border-color);
                    border-radius: 12px;
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    transition: all 0.2s;
                }

                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .type-options {
                    display: flex;
                    gap: 0.75rem;
                }

                .type-btn {
                    flex: 1;
                    padding: 0.75rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    background: var(--bg-tertiary);
                    border: 2px solid var(--border-color);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .type-btn:hover {
                    border-color: var(--accent-primary);
                }

                .type-btn.active {
                    background: var(--accent-gradient);
                    color: white;
                    border-color: transparent;
                }

                .specs-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .spec-btn {
                    padding: 0.5rem 1rem;
                    font-size: 0.8125rem;
                    color: var(--text-secondary);
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .spec-btn:hover {
                    border-color: var(--accent-primary);
                }

                .spec-btn.active {
                    background: var(--accent-gradient-soft);
                    color: var(--accent-primary);
                    border-color: var(--accent-primary);
                }

                .terms-label {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                }

                .terms-label input {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }

                .submit-btn {
                    padding: 1rem;
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: white;
                    background: var(--accent-gradient);
                    border: none;
                    border-radius: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: var(--accent-glow);
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                }

                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .login-link {
                    text-align: center;
                    margin-top: 1.5rem;
                    font-size: 0.9375rem;
                    color: var(--text-secondary);
                }

                .login-link a {
                    color: var(--accent-primary);
                    font-weight: 600;
                }

                @media (max-width: 640px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .type-options {
                        flex-direction: column;
                    }

                    .register-card {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loading-dots"><span></span><span></span><span></span></div>
            </div>
        }>
            <RegisterContent />
        </Suspense>
    );
}
