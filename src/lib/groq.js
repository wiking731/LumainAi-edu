import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Regular completion (non-streaming)
export async function getGroqCompletion(messages, systemPrompt) {
    const chatMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }))
    ];

    const chatCompletion = await groq.chat.completions.create({
        messages: chatMessages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
    });

    return chatCompletion.choices[0]?.message?.content || '';
}

// Streaming completion - returns async generator
export async function* getGroqStream(messages, systemPrompt) {
    const chatMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
    ];

    const stream = await groq.chat.completions.create({
        messages: chatMessages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
        stream: true,
    });

    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
            yield content;
        }
    }
}
