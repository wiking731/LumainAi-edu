'use client';

import { useRef, useState } from 'react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TEXT_LENGTH = 40000; // ~10k tokens
const ACCEPTED_TYPES = ['.pdf', '.docx', '.txt'];

const translations = {
    uz: {
        upload: "Fayl yuklash",
        processing: "Qayta ishlanmoqda...",
        tooLarge: "Fayl 10MB dan katta",
        typeError: "Faqat PDF, DOCX, TXT formatlar",
        textTooLong: "Matn juda uzun (40,000 belgidan kam bo'lishi kerak)",
        ready: "Tahlil qilishga tayyor",
        remove: "Olib tashlash"
    },
    ru: {
        upload: "Загрузить файл",
        processing: "Обработка...",
        tooLarge: "Файл больше 10MB",
        typeError: "Только PDF, DOCX, TXT форматы",
        textTooLong: "Текст слишком длинный (макс 40,000 символов)",
        ready: "Готов к анализу",
        remove: "Удалить"
    }
};

export default function FileUpload({ lang = 'uz', onFileContent, onError }) {
    const inputRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileName, setFileName] = useState(null);
    const t = translations[lang];

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            onError?.(t.tooLarge);
            return;
        }

        // Check file type
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (!ACCEPTED_TYPES.includes(ext)) {
            onError?.(t.typeError);
            return;
        }

        setIsProcessing(true);
        setFileName(file.name);

        try {
            let text = '';

            if (ext === '.txt') {
                text = await file.text();
            } else {
                // For PDF/DOCX, we'll read as text for demo
                // In production, you'd use pdf-parse or mammoth
                text = await file.text();
            }

            // Check text length
            if (text.length > MAX_TEXT_LENGTH) {
                onError?.(t.textTooLong);
                setIsProcessing(false);
                setFileName(null);
                return;
            }

            onFileContent?.(text, file.name);
            setIsProcessing(false);
        } catch (err) {
            onError?.('Error reading file');
            setIsProcessing(false);
            setFileName(null);
        }

        // Reset input
        e.target.value = '';
    };

    const handleRemove = () => {
        setFileName(null);
        onFileContent?.(null, null);
    };

    return (
        <div className="file-upload">
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            {fileName ? (
                <div className="file-badge">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{fileName.length > 15 ? fileName.slice(0, 12) + '...' : fileName}</span>
                    <button className="file-remove" onClick={handleRemove}>×</button>
                </div>
            ) : (
                <button
                    className="upload-btn"
                    onClick={handleClick}
                    disabled={isProcessing}
                    title={t.upload}
                >
                    {isProcessing ? '⏳' : '+'}
                </button>
            )}

            <style jsx>{`
                .file-upload {
                    display: flex;
                    align-items: center;
                }

                .upload-btn {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: none;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.15s ease;
                }

                .upload-btn:hover {
                    background: var(--bg-hover);
                    color: var(--accent-primary);
                }

                .upload-btn:disabled {
                    cursor: wait;
                }

                .file-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.25rem 0.5rem;
                    background: var(--accent-gradient-soft);
                    border-radius: 8px;
                    font-size: 0.75rem;
                }

                .file-icon {
                    font-size: 0.875rem;
                }

                .file-name {
                    color: var(--text-primary);
                    font-weight: 500;
                    max-width: 100px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .file-remove {
                    width: 18px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--danger-bg);
                    border: none;
                    border-radius: 50%;
                    font-size: 0.875rem;
                    color: var(--danger);
                    cursor: pointer;
                    transition: all 0.15s ease;
                }

                .file-remove:hover {
                    background: var(--danger);
                    color: white;
                }
            `}</style>
        </div>
    );
}
