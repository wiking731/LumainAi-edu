// Streaming API Route for Advo AI Analysis

import { getGroqStream } from '@/lib/groq';
import { getLegalAnalysisPrompt, getConversationalPrompt } from '@/lib/prompts/legalAnalysis';
import { getTosAnalysisPrompt, isToSAnalysisRequest } from '@/lib/prompts/tosAnalysis';

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

        if (mode === 'tos') {
            systemPrompt = getTosAnalysisPrompt(language);
        } else if (mode === 'legal') {
            if (isLegalSituationRequest(message)) {
                systemPrompt = getLegalAnalysisPrompt(language);
            } else {
                systemPrompt = getConversationalPrompt(language);
            }
        } else {
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
