// src/chat/chat.controller.ts
import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {MicaChatService} from './mica-chat.service';
import {CreateMessageDto} from './dto/create-message.dto';
import {CurrentUser} from "../../common/decorators/current-user.decorator";
import {JwtAuthGuard} from "../auth/jwt.strategy";
import type {AuthenticatedUser} from "../../common/types";

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class MicaChatController {
    constructor(private readonly chatService: MicaChatService) {
    }

    @Post('messages')

    sendMessage(@Body() dto: CreateMessageDto, @CurrentUser() user: AuthenticatedUser) {
        const userId = user.userId;
        return this.chatService.sendMessage(userId, dto);
    }

    @Get('conversations/:id/history')
    getHistory(@Param('id') conversationId: string) {
        return this.chatService.getHistory(conversationId);
    }
}