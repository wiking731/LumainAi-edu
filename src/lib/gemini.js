// Gemini API Client for Advo AI

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Get the model
export function getGeminiModel() {
    return genAI.getGenerativeModel({
        model: 'models/gemini-1.5-flash',
        generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 2048,
        },
        safetySettings: [
            {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_ONLY_HIGH',
            },
            {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_ONLY_HIGH',
            },
            {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_ONLY_HIGH',
            },
            {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_ONLY_HIGH',
            },
        ],
    });
}

// Generate response with system prompt
export async function generateResponse(systemPrompt, userMessage, conversationHistory = []) {
    try {
        const model = getGeminiModel();

        // Build the conversation
        let fullPrompt = systemPrompt + '\n\n---\n\n';

        // Add conversation history
        if (conversationHistory.length > 0) {
            fullPrompt += 'Previous conversation:\n';
            conversationHistory.forEach(msg => {
                const role = msg.role === 'user' ? 'User' : 'Assistant';
                fullPrompt += `${role}: ${msg.content}\n\n`;
            });
            fullPrompt += '---\n\n';
        }

        fullPrompt += `Current user message: ${userMessage}\n\nYour response:`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        return {
            success: true,
            response: text
        };
    } catch (error) {
        console.error('Gemini API Error:', error);

        // Handle specific error types
        if (error.message?.includes('API_KEY')) {
            return {
                success: false,
                error: 'API key is missing or invalid'
            };
        }

        if (error.message?.includes('quota')) {
            return {
                success: false,
                error: 'API quota exceeded. Please try again later.'
            };
        }

        if (error.message?.includes('SAFETY')) {
            return {
                success: false,
                error: 'Content was blocked by safety filters'
            };
        }

        return {
            success: false,
            error: error.message || 'Unknown error occurred'
        };
    }
}

// Check if API key is configured
export function isConfigured() {
    return !!process.env.GEMINI_API_KEY;
}







