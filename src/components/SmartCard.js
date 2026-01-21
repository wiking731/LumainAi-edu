'use client';

import ReactMarkdown from 'react-markdown';

// Parse AI response and detect if it's structured JSON
function parseResponse(content) {
    try {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            return { type: 'json', data: JSON.parse(jsonMatch[1]) };
        }

        // Try to parse as direct JSON
        if (content.trim().startsWith('{')) {
            return { type: 'json', data: JSON.parse(content) };
        }
    } catch (e) {
        // Not JSON, return as text
    }
    return { type: 'text', data: content };
}

// Subsidy Result Card
function SubsidyCard({ data, lang }) {
    return (
        <div className="smart-card subsidy-card">
            <div className="card-header success">
                <span className="card-icon">💰</span>
                <div>
                    <h3>{lang === 'uz' ? `TOPILDI: ${data.count || data.programs?.length || 0} TA DASTUR` : `НАЙДЕНО: ${data.count || data.programs?.length || 0} ПРОГРАММ`}</h3>
                </div>
            </div>
            <div className="card-body">
                {data.programs?.map((program, idx) => (
                    <div key={idx} className="program-item">
                        <div className="program-header">
                            <span className="program-number">{idx + 1}</span>
                            <h4>{program.name || program.name_uz}</h4>
                        </div>
                        <ul className="program-benefits">
                            {program.benefits?.map((benefit, bidx) => (
                                <li key={bidx}>
                                    {typeof benefit === 'string' ? benefit : benefit[lang] || benefit.uz}
                                </li>
                            ))}
                        </ul>
                        {program.legal_basis && (
                            <p className="legal-basis">📎 Asos: {program.legal_basis}</p>
                        )}
                    </div>
                ))}
            </div>
            {data.cta === 'find_lawyer' && (
                <div className="card-footer">
                    <a href="/marketplace" className="cta-button">
                        📍 {lang === 'uz' ? 'Mutaxassis topish' : 'Найти специалиста'}
                    </a>
                </div>
            )}
            <style jsx>{`
                .smart-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: var(--shadow-md);
                    border: 1px solid var(--border-color);
                }
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.25rem;
                    border-bottom: 1px solid var(--border-light);
                }
                .card-header.success {
                    background: var(--success-bg);
                }
                .card-header.warning {
                    background: var(--warning-bg);
                }
                .card-header.danger {
                    background: var(--danger-bg);
                }
                .card-icon {
                    font-size: 1.5rem;
                }
                .card-header h3 {
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: var(--success);
                    margin: 0;
                }
                .card-body {
                    padding: 1.25rem;
                }
                .program-item {
                    margin-bottom: 1.25rem;
                    padding-bottom: 1.25rem;
                    border-bottom: 1px solid var(--border-light);
                }
                .program-item:last-child {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    border-bottom: none;
                }
                .program-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                .program-number {
                    width: 24px;
                    height: 24px;
                    background: var(--accent-gradient);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                }
                .program-header h4 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0;
                }
                .program-benefits {
                    margin: 0.5rem 0;
                    padding-left: 2.5rem;
                }
                .program-benefits li {
                    font-size: 0.9375rem;
                    color: var(--text-secondary);
                    margin-bottom: 0.25rem;
                }
                .legal-basis {
                    font-size: 0.8125rem;
                    color: var(--text-muted);
                    margin: 0.5rem 0 0 2.5rem;
                }
                .card-footer {
                    padding: 1rem 1.25rem;
                    border-top: 1px solid var(--border-light);
                    background: var(--bg-tertiary);
                }
                .cta-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.625rem 1.25rem;
                    background: var(--accent-gradient);
                    color: white;
                    font-size: 0.875rem;
                    font-weight: 600;
                    border-radius: 9999px;
                    text-decoration: none;
                    box-shadow: var(--accent-glow);
                    transition: all 0.2s;
                }
                .cta-button:hover {
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
}

// Risk Analysis Card
function RiskCard({ data, lang }) {
    const level = data.risk_score >= 70 ? 'high' : data.risk_score >= 40 ? 'medium' : 'low';
    const levelColors = {
        high: { bg: 'var(--danger-bg)', color: 'var(--danger)', label: lang === 'uz' ? 'YUQORI XAVF' : 'ВЫСОКИЙ РИСК' },
        medium: { bg: 'var(--warning-bg)', color: 'var(--warning)', label: lang === 'uz' ? "O'RTA XAVF" : 'СРЕДНИЙ РИСК' },
        low: { bg: 'var(--success-bg)', color: 'var(--success)', label: lang === 'uz' ? 'PAST XAVF' : 'НИЗКИЙ РИСК' }
    };
    const config = levelColors[level];

    return (
        <div className="smart-card risk-card">
            <div className={`card-header ${level === 'high' ? 'danger' : level === 'medium' ? 'warning' : 'success'}`}>
                <span className="card-icon">⚠️</span>
                <div>
                    <h3 style={{ color: config.color }}>{config.label}</h3>
                    <p className="score">📊 {lang === 'uz' ? 'Xavf darajasi' : 'Уровень риска'}: {data.risk_score}/100</p>
                </div>
            </div>
            <div className="card-body">
                {data.dangers?.length > 0 && (
                    <div className="section">
                        <h4>⚠️ {lang === 'uz' ? 'Xavfli bandlar' : 'Опасные пункты'}:</h4>
                        <ul className="danger-list">
                            {data.dangers.map((danger, idx) => (
                                <li key={idx}>{danger}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {data.safe?.length > 0 && (
                    <div className="section">
                        <h4>✅ {lang === 'uz' ? 'Yaxshi tomonlari' : 'Хорошие стороны'}:</h4>
                        <ul className="safe-list">
                            {data.safe.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {data.recommendation && (
                    <p className="recommendation">
                        🎯 {data.recommendation === 'lawyer_required'
                            ? (lang === 'uz' ? 'Bu masala murakkab. Mutaxassis talab etiladi.' : 'Это сложный вопрос. Требуется специалист.')
                            : data.recommendation}
                    </p>
                )}
            </div>
            {data.cta === 'find_lawyer' && level !== 'low' && (
                <div className="card-footer">
                    <a href="/marketplace?specialty=contract" className="cta-button danger">
                        👨‍⚖️ {lang === 'uz' ? 'Mutaxassis topish' : 'Найти специалиста'}
                    </a>
                </div>
            )}
            <style jsx>{`
                .smart-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: var(--shadow-md);
                    border: 1px solid var(--border-color);
                }
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.25rem;
                    border-bottom: 1px solid var(--border-light);
                }
                .card-header.danger { background: var(--danger-bg); }
                .card-header.warning { background: var(--warning-bg); }
                .card-header.success { background: var(--success-bg); }
                .card-icon { font-size: 1.5rem; }
                .card-header h3 {
                    font-size: 0.875rem;
                    font-weight: 700;
                    margin: 0;
                }
                .score {
                    font-size: 0.8125rem;
                    color: var(--text-secondary);
                    margin: 0.25rem 0 0 0;
                }
                .card-body { padding: 1.25rem; }
                .section { margin-bottom: 1rem; }
                .section h4 {
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                .danger-list li {
                    color: var(--danger);
                    font-size: 0.9375rem;
                    margin-bottom: 0.25rem;
                }
                .safe-list li {
                    color: var(--success);
                    font-size: 0.9375rem;
                    margin-bottom: 0.25rem;
                }
                .recommendation {
                    padding: 0.75rem 1rem;
                    background: var(--bg-tertiary);
                    border-radius: 8px;
                    font-size: 0.9375rem;
                    font-weight: 500;
                }
                .card-footer {
                    padding: 1rem 1.25rem;
                    border-top: 1px solid var(--border-light);
                    background: var(--bg-tertiary);
                }
                .cta-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.625rem 1.25rem;
                    color: white;
                    font-size: 0.875rem;
                    font-weight: 600;
                    border-radius: 9999px;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .cta-button.danger {
                    background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
                }
                .cta-button:hover { transform: translateY(-2px); }
            `}</style>
        </div>
    );
}

// Main SmartCard component
export default function SmartCard({ content, lang = 'uz' }) {
    const parsed = parseResponse(content);

    if (parsed.type === 'json') {
        const data = parsed.data;

        // Detect card type
        if (data.type === 'subsidy_result' || data.programs) {
            return <SubsidyCard data={data} lang={lang} />;
        }
        if (data.type === 'risk_analysis' || data.risk_score !== undefined) {
            return <RiskCard data={data} lang={lang} />;
        }
    }

    // Fallback to markdown rendering
    return (
        <div className="markdown-content">
            <ReactMarkdown>{content}</ReactMarkdown>
            <style jsx global>{`
                .markdown-content {
                    font-size: 0.9375rem;
                    line-height: 1.7;
                    color: var(--text-primary);
                }
                .markdown-content h1, .markdown-content h2, .markdown-content h3 {
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                .markdown-content p { margin-bottom: 1rem; }
                .markdown-content ul, .markdown-content ol {
                    margin-bottom: 1rem;
                    padding-left: 1.5rem;
                }
                .markdown-content li { margin-bottom: 0.5rem; }
                .markdown-content strong { color: var(--accent-primary); }
                .markdown-content code {
                    background: var(--bg-tertiary);
                    padding: 0.125rem 0.375rem;
                    border-radius: 4px;
                    font-size: 0.875em;
                }
            `}</style>
        </div>
    );
}
