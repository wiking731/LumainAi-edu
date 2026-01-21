'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import scoutLogsData from '@/data/scout_logs.json';

const translations = {
    uz: {
        title: "Scout Agent",
        subtitle: "Yangi qonunlarni avtomatik monitoring",
        trigger: "Qo'lda ishga tushirish",
        lastScan: "Oxirgi skanerlash",
        stats: {
            total: "Jami skanerlangan",
            ingested: "Bazaga qo'shilgan",
            newThisWeek: "Shu haftada yangi"
        },
        logs: "So'nggi loglar",
        status: {
            success: "Bazaga qo'shildi",
            skipped: "O'tkazib yuborildi"
        },
        relevance: "Relevantlik"
    },
    ru: {
        title: "Scout Agent",
        subtitle: "Автоматический мониторинг новых законов",
        trigger: "Запустить вручную",
        lastScan: "Последнее сканирование",
        stats: {
            total: "Всего просканировано",
            ingested: "Добавлено в базу",
            newThisWeek: "Новых за неделю"
        },
        logs: "Последние логи",
        status: {
            success: "Добавлено в базу",
            skipped: "Пропущено"
        },
        relevance: "Релевантность"
    }
};

function ScoutContent() {
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'uz';
    const t = translations[lang];

    const [logs, setLogs] = useState(scoutLogsData.logs);
    const [stats, setStats] = useState(scoutLogsData.stats);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState('');

    const handleTriggerScan = async () => {
        setIsScanning(true);
        setScanProgress(lang === 'uz' ? "Lex.uz dan qidirilmoqda..." : "Поиск на Lex.uz...");

        // Simulate scanning process
        await new Promise(r => setTimeout(r, 1500));
        setScanProgress(lang === 'uz' ? "Groq AI bilan tahlil qilinmoqda..." : "Анализ с Groq AI...");

        await new Promise(r => setTimeout(r, 2000));
        setScanProgress(lang === 'uz' ? "Bazaga qo'shilmoqda..." : "Добавление в базу...");

        await new Promise(r => setTimeout(r, 1000));

        // Add new mock log entry
        const newLog = {
            id: `log_${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'success',
            action: 'ingest',
            title_uz: `PQ-${Math.floor(Math.random() * 1000)}: Yangi soliq imtiyozlari`,
            title_ru: `ПП-${Math.floor(Math.random() * 1000)}: Новые налоговые льготы`,
            source: 'lex.uz',
            relevance_score: 85 + Math.floor(Math.random() * 10),
            message_uz: "Topildi va bazaga qo'shildi",
            message_ru: "Найдено и добавлено в базу"
        };

        setLogs(prev => [newLog, ...prev]);
        setStats(prev => ({
            ...prev,
            total_scanned: prev.total_scanned + 3,
            total_ingested: prev.total_ingested + 1,
            new_this_week: prev.new_this_week + 1,
            last_scan: new Date().toISOString()
        }));

        setScanProgress('');
        setIsScanning(false);
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString(lang === 'uz' ? 'uz-UZ' : 'ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="scout-container">
            <Navbar lang={lang} />

            <main className="scout-main">
                <div className="scout-header">
                    <div className="header-left">
                        <h1>📊 {t.title}</h1>
                        <p>{t.subtitle}</p>
                    </div>
                    <button
                        className={`trigger-btn ${isScanning ? 'scanning' : ''}`}
                        onClick={handleTriggerScan}
                        disabled={isScanning}
                    >
                        {isScanning ? '...' : `🔄 ${t.trigger}`}
                    </button>
                </div>

                {/* Progress */}
                {scanProgress && (
                    <div className="scan-progress">
                        <div className="progress-bar"></div>
                        <span>{scanProgress}</span>
                    </div>
                )}

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-icon">🔍</span>
                        <div className="stat-value">{stats.total_scanned}</div>
                        <div className="stat-label">{t.stats.total}</div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">✅</span>
                        <div className="stat-value">{stats.total_ingested}</div>
                        <div className="stat-label">{t.stats.ingested}</div>
                    </div>
                    <div className="stat-card highlight">
                        <span className="stat-icon">📈</span>
                        <div className="stat-value">{stats.new_this_week}</div>
                        <div className="stat-label">{t.stats.newThisWeek}</div>
                    </div>
                </div>

                {/* Logs Terminal */}
                <div className="terminal">
                    <div className="terminal-header">
                        <div className="terminal-dots">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                        </div>
                        <span className="terminal-title">📋 {t.logs}</span>
                        <span className="terminal-time">{t.lastScan}: {formatTime(stats.last_scan)}</span>
                    </div>
                    <div className="terminal-body">
                        {logs.map((log, idx) => (
                            <div key={log.id} className={`log-entry ${log.status}`}>
                                <span className="log-time">{formatTime(log.timestamp)}</span>
                                <span className={`log-status ${log.status}`}>
                                    {log.status === 'success' ? '✅' : '⏭️'}
                                </span>
                                <span className="log-title">
                                    {lang === 'uz' ? log.title_uz : log.title_ru}
                                </span>
                                <span className="log-relevance">
                                    {t.relevance}: {log.relevance_score}%
                                </span>
                                <span className="log-message">
                                    → {lang === 'uz' ? log.message_uz : log.message_ru}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <style jsx>{`
                .scout-container {
                    min-height: 100vh;
                    background: #1a1b26;
                    color: #a9b1d6;
                }

                .scout-main {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: calc(64px + 2rem) 1.5rem 3rem;
                }

                .scout-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .scout-header h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #c0caf5;
                    margin-bottom: 0.25rem;
                }

                .scout-header p {
                    color: #565f89;
                }

                .trigger-btn {
                    padding: 0.875rem 1.5rem;
                    font-size: 0.9375rem;
                    font-weight: 600;
                    color: #1a1b26;
                    background: linear-gradient(135deg, #7aa2f7 0%, #bb9af7 100%);
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .trigger-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 0 20px rgba(122, 162, 247, 0.4);
                }

                .trigger-btn.scanning {
                    opacity: 0.7;
                    animation: pulse 1s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }

                .scan-progress {
                    background: #24283b;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 1.5rem;
                    position: relative;
                    overflow: hidden;
                }

                .scan-progress .progress-bar {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 3px;
                    width: 100%;
                    background: linear-gradient(90deg, #7aa2f7, #bb9af7, #7aa2f7);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite linear;
                }

                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }

                .scan-progress span {
                    color: #7aa2f7;
                    font-family: 'Fira Code', monospace;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    background: #24283b;
                    border-radius: 16px;
                    padding: 1.5rem;
                    text-align: center;
                    border: 1px solid #414868;
                }

                .stat-card.highlight {
                    background: linear-gradient(135deg, rgba(122, 162, 247, 0.1) 0%, rgba(187, 154, 247, 0.1) 100%);
                    border-color: #7aa2f7;
                }

                .stat-icon {
                    font-size: 1.5rem;
                    display: block;
                    margin-bottom: 0.5rem;
                }

                .stat-value {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #c0caf5;
                }

                .stat-label {
                    font-size: 0.8125rem;
                    color: #565f89;
                    margin-top: 0.25rem;
                }

                .terminal {
                    background: #24283b;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid #414868;
                }

                .terminal-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.5rem;
                    background: #1a1b26;
                    border-bottom: 1px solid #414868;
                }

                .terminal-dots {
                    display: flex;
                    gap: 0.5rem;
                }

                .dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                }

                .dot.red { background: #f7768e; }
                .dot.yellow { background: #e0af68; }
                .dot.green { background: #9ece6a; }

                .terminal-title {
                    flex: 1;
                    font-weight: 600;
                    color: #c0caf5;
                }

                .terminal-time {
                    font-size: 0.8125rem;
                    color: #565f89;
                }

                .terminal-body {
                    max-height: 400px;
                    overflow-y: auto;
                    padding: 1rem;
                }

                .log-entry {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    margin-bottom: 0.5rem;
                    font-family: 'Fira Code', 'Consolas', monospace;
                    font-size: 0.875rem;
                    transition: background 0.2s;
                }

                .log-entry:hover {
                    background: rgba(122, 162, 247, 0.1);
                }

                .log-entry.success {
                    border-left: 3px solid #9ece6a;
                }

                .log-entry.skipped {
                    border-left: 3px solid #565f89;
                }

                .log-time {
                    color: #565f89;
                    min-width: 50px;
                }

                .log-status {
                    font-size: 1rem;
                }

                .log-title {
                    color: #c0caf5;
                    font-weight: 500;
                    flex: 1;
                    min-width: 200px;
                }

                .log-relevance {
                    color: #7aa2f7;
                    font-size: 0.75rem;
                    padding: 0.25rem 0.5rem;
                    background: rgba(122, 162, 247, 0.1);
                    border-radius: 4px;
                }

                .log-message {
                    width: 100%;
                    color: #9ece6a;
                    font-size: 0.8125rem;
                    padding-left: 4rem;
                }

                .log-entry.skipped .log-message {
                    color: #565f89;
                }

                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .scout-header {
                        flex-direction: column;
                        gap: 1rem;
                        text-align: center;
                    }

                    .log-entry {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .log-message {
                        padding-left: 0;
                    }
                }
            `}</style>
        </div>
    );
}

export default function ScoutPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', background: '#1a1b26', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#7aa2f7' }}>Loading...</div>
            </div>
        }>
            <ScoutContent />
        </Suspense>
    );
}
