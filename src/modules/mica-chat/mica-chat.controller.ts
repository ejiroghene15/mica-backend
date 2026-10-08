// src/chat/chat.controller.ts
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MicaChatService } from './mica-chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

// @UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class MicaChatController {
  constructor(private readonly chatService: MicaChatService) {}

  @Post('messages')
   
  sendMessage( @Body() dto: CreateMessageDto) {
    const userId = 'cmj8k2x4p0000v3l5g7h9q1ab';
    return this.chatService.sendMessage(userId, dto);
  }

  @Get('conversations/:id/history')
  getHistory(@Param('id') conversationId: string) {
    return this.chatService.getHistory(conversationId);
  }
}