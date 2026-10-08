// ai.service.ts
import {Injectable} from '@nestjs/common';
import {GoogleGenAI} from '@google/genai';
import {env} from "prisma/config";


@Injectable()
export class AiService {
    private client = new GoogleGenAI({apiKey: env('GEMINI_API_KEY')});

    async* streamReply(history: { role: 'user' | 'assistant'; content: string }[]) {
        // Gemini's roles are 'user' and 'model', not 'assistant' — remap here
        const contents = history.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{text: m.content}],
        }));

        const stream = await this.client.models.generateContentStream({
            model: 'gemini-3.6-flash',
            contents,
            config: {
                systemInstruction: 'You are a helpful assistant in a support chat. Be concise and direct.',
                maxOutputTokens: 1024,
            },
        });

        for await (const chunk of stream) {
            const text = chunk.text;
            if (text) yield text;
        }
    }
}