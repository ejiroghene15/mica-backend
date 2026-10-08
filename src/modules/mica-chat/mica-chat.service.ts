// src/modules/mica-chat/mica-chat.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { ConversationRepository } from './entitites/conversation-repo';
import { ChatMessageRepository } from './entitites/chat-message-repo';
import { IApiResponse, buildResponse } from './interfaces/api-response.interface';
import { CreateMessageDto } from './dto/create-message.dto';

const SYSTEM_PROMPT =
  'You are Mica, a warm and supportive companion in an emotional check-in app. ' +
  'Respond with empathy, keep replies short (2-4 sentences), avoid giving clinical advice, ' +
  'and end with one gentle follow-up question.';

@Injectable()
export class MicaChatService {
  private readonly logger = new Logger(MicaChatService.name);
  private readonly openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  constructor(
    private readonly conversationRepo: ConversationRepository,
    private readonly messageRepo: ChatMessageRepository,
  ) {
    this.logger.log(`OpenAI key loaded: ${!!process.env.OPENAI_API_KEY}`);
  }

  async sendMessage(userId: string, dto: CreateMessageDto): Promise<IApiResponse> {
    const conversation = dto.conversationId
      ? await this.conversationRepo.findUnique({ id: dto.conversationId })
      : await this.conversationRepo.create({
          user: { connect: { id: userId } },
          title: dto.text.slice(0, 50),
          preview: dto.text.slice(0, 100),
        });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // 1. Save the user's message
    const message = await this.messageRepo.create({
      conversation: { connect: { id: conversation.id } },
      role: 'user',
      text: dto.text,
    });

    // 2. Load recent history (includes the message we just saved)
    const recent = await this.messageRepo.findRecentByConversation(conversation.id);
    const history = [...recent]
      .sort((a: any, b: any) => +new Date(a.createdAt) - +new Date(b.createdAt))
      .slice(-20);

    // 3. Ask OpenAI for a reply
    let replyText: string;
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // check OpenAI's docs for current model names
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history.map((m: any) => ({
            role: m.role as 'user' | 'assistant',
            content: m.text as string,
          })),
        ],
      });
      replyText = completion.choices[0]?.message?.content?.trim() ?? '';
    } catch (err) {
      this.logger.error('OpenAI request failed', err as Error);
      throw new ServiceUnavailableException('Mica could not respond right now. Please try again.');
    }

    if (!replyText) {
      throw new ServiceUnavailableException('Mica returned an empty response.');
    }

    // 4. Save the assistant's reply
    const reply = await this.messageRepo.create({
      conversation: { connect: { id: conversation.id } },
      role: 'assistant',
      text: replyText,
    });

    return buildResponse(true, 'Message sent successfully', {
      conversationId: conversation.id,
      message,
      reply,
    });
  }

  async getHistory(conversationId: string): Promise<IApiResponse> {
    const history = await this.messageRepo.findRecentByConversation(conversationId);
    return buildResponse(true, 'History retrieved successfully', { messages: history });
  }
}