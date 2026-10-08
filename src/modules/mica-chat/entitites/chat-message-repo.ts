// src/chat/entities/chat-message-repo.ts
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../common/shared/baseRepsitory';
import { PrismaService } from '../../../core/services/prisma.service';

@Injectable()
export class ChatMessageRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma.chatMessage);
  }

  findRecentByConversation(conversationId: string, limit = 20) {
    return this.delegate.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}