import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {CreateChatDto} from "./dto/create-chat.dto";
import {ChatService} from "./chat.service";
import {CurrentUser} from "../../common/decorators/current-user.decorator";
import {JwtAuthGuard} from "../auth/jwt.strategy";
import type {AuthenticatedUser} from "../../common/types";

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) {
    }

    @Post()
    create(@Body() createChatDto: CreateChatDto, @CurrentUser() user: AuthenticatedUser) {
        return this.chatService.create(createChatDto, user.userId);
    }

    @Get()
    findAll(@CurrentUser() user: AuthenticatedUser) {
        return this.chatService.findAll(user.userId);
    }

    @Get(':id')
    find(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.chatService.findOne(user.userId, id);
    }
}
