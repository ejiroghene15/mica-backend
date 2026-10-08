import { Module } from '@nestjs/common';
import { MicaChatController } from './mica-chat.controller';
import { MicaChatService } from './mica-chat.service';
import { ConversationRepository } from './entitites/conversation-repo';
import { ChatMessageRepository } from './entitites/chat-message-repo';
// import { MicaChatGateway } from './mica-chat.gateway';

@Module({
  controllers: [MicaChatController],
  providers: [MicaChatService,
    ConversationRepository,
    ChatMessageRepository,]
})
export class MicaChatModule {}
