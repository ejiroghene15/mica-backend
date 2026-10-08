// src/chat/entities/conversation-repo.ts
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../common/shared/baseRepsitory';
import { PrismaService } from '../../../core/services/prisma.service';

@Injectable()
export class ConversationRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma.conversation);
  }

  findByIdWithMessages(id: string) {
    return this.delegate.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }
}