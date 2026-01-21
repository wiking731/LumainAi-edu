// Streaming API Route for Advo AI Analysis

import { getGroqStream } from '@/lib/groq';
import { getLegalAnalysisPrompt, getConversationalPrompt } from '@/lib/prompts/legalAnalysis';
import { getTosAnalysisPrompt, isToSAnalysisRequest } from '@/lib/prompts/tosAnalysis';
import { getImtiyozPrompt } from '@/lib/prompts/imtiyozPrompt';

// Contract Review Prompt
function getContractReviewPrompt(language) {
    const isUzbek = language === 'uz';
    return isUzbek ? `
Siz AdvoAI Shartnoma Tekshiruvchisi - shartnomalar va huquqiy hujjatlarni tahlil qiluvchi ekspertsiz.

VAZIFANGIZ: Berilgan shartnoma matnini diqqat bilan o'qing va xavfli bandlarni aniqlang.

XAVF TURLARI:
1. Avtomatik uzaytirish (yashirin to'lov)
2. Javobgarlikni cheklash
3. Bir tomonlama bekor qilish huquqi
4. Noma'lum to'lovlar va komissiyalar
5. Shaxsiy ma'lumotlarni uchinchi shaxslarga berish

JAVOB FORMATI (JSON):
\`\`\`json
{
  "type": "risk_analysis",
  "risk_score": [0-100 orasida ball],
  "level": "low|medium|high",
  "dangers": ["Xavfli band 1", "Xavfli band 2"],
  "safe": ["Yaxshi band 1"],
  "recommendation": "lawyer_required yoki tushunarli",
  "cta": "find_lawyer"
}
\`\`\`

MUHIM: Xavf darajasi 70 dan yuqori bo'lsa, "lawyer_required" tavsiya qiling.
` : `
Вы AdvoAI Анализатор Договоров - эксперт по анализу договоров и юридических документов.

ВАША ЗАДАЧА: Внимательно прочитать текст договора и выявить опасные пункты.

ТИПЫ РИСКОВ:
1. Автоматическое продление (скрытые платежи)
2. Ограничение ответственности
3. Одностороннее расторжение
4. Неясные платежи и комиссии
5. Передача личных данных третьим лицам

ФОРМАТ ОТВЕТА (JSON):
\`\`\`json
{
  "type": "risk_analysis",
  "risk_score": [балл от 0 до 100],
  "level": "low|medium|high",
  "dangers": ["Опасный пункт 1", "Опасный пункт 2"],
  "safe": ["Хороший пункт 1"],
  "recommendation": "lawyer_required или понятно",
  "cta": "find_lawyer"
}
\`\`\`

ВАЖНО: Если уровень риска выше 70, рекомендуйте "lawyer_required".
`;
}

export async function POST(request) {
    try {
        // Check if GROQ API is configured
        if (!process.env.GROQ_API_KEY) {
            return new Response(
                JSON.stringify({ error: 'GROQ_API_KEY is not configured.' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const body = await request.json();
        const { message, language = 'uz', mode = 'legal', history = [] } = body;

        if (!message || typeof message !== 'string') {
            return new Response(
                JSON.stringify({ error: 'Message is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Select prompt based on mode
        let systemPrompt;

        if (mode === 'imtiyoz') {
            // T-3 Mode: Subsidies and benefits
            systemPrompt = getImtiyozPrompt(language);
        } else if (mode === 'contract') {
            // Contract review mode
            systemPrompt = getContractReviewPrompt(language);
        } else if (mode === 'tos') {
            systemPrompt = getTosAnalysisPrompt(language);
        } else if (mode === 'legal') {
            if (isLegalSituationRequest(message)) {
                systemPrompt = getLegalAnalysisPrompt(language);
            } else {
                systemPrompt = getConversationalPrompt(language);
            }
        } else {
            // Auto-detect mode
            if (isToSAnalysisRequest(message)) {
                systemPrompt = getTosAnalysisPrompt(language);
            } else if (isLegalSituationRequest(message)) {
                systemPrompt = getLegalAnalysisPrompt(language);
            } else {
                systemPrompt = getConversationalPrompt(language);
            }
        }

        // Format history for GROQ
        const formattedHistory = history.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

        // Add current message
        formattedHistory.push({ role: 'user', content: message });

        // Create streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const generator = getGroqStream(formattedHistory, systemPrompt);

                    for await (const chunk of generator) {
                        // Send as SSE format
                        const data = JSON.stringify({ content: chunk });
                        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                    }

                    // Send done signal
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    console.error('Streaming error:', error);
                    const errorData = JSON.stringify({ error: error.message });
                    controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('API Error:', error);
        return new Response(
            JSON.stringify({ error: error.message || 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// Detect if the message is a legal situation request
function isLegalSituationRequest(message) {
    const legalKeywords = [
        // Uzbek legal terms
        'ish beruvchi', 'ishdan bo\'shatdi', 'kasallik', 'ta\'til', 'maosh', 'oylik',
        'mulk', 'qo\'shni', 'ajralish', 'nikoh', 'nafaqa', 'alimentlar', 'farzand',
        'shartnoma', 'qarz', 'kredit', 'jazo', 'jarima', 'ariza', 'shikoyat',
        'mahkama', 'sud', 'advokat', 'huquq', 'qonun', 'buzildi', 'aldadi',
        'pulim', 'to\'lamadi', 'qaytarmadi', 'talashish', 'tortishuv', 'janjal',
        'ishdan', 'boshatdi', 'boshatildi', 'ogohlantirmasdan', 'kafolat',
        // Russian legal terms
        'работодатель', 'уволили', 'увольнение', 'болезнь', 'отпуск', 'зарплата',
        'имущество', 'сосед', 'развод', 'брак', 'алименты', 'ребенок', 'дети',
        'договор', 'долг', 'кредит', 'штраф', 'заявление', 'жалоба',
        'суд', 'адвокат', 'права', 'закон', 'нарушили', 'обманули',
        'деньги', 'не заплатили', 'не вернули', 'спор', 'конфликт',
        // Question indicators
        'nima qilishim', 'qanday qilsam', 'huquqim bormi', 'mumkinmi',
        'что делать', 'как быть', 'имею ли право', 'могу ли'
    ];

    const lowerMessage = message.toLowerCase();
    return legalKeywords.some(keyword => lowerMessage.includes(keyword));
}
