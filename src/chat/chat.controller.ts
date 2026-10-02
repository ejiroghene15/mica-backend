import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {CreateChatDto} from "./dto/create-chat.dto";
import {ChatService} from "./chat.service";
import {CurrentUser} from "../common/decorators/current-user.decorator";
import {JwtAuthGuard} from "../auth/jwt.strategy";
import type {SafeUser} from "../common/types";

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) {
    }

    @Post()
    create(@Body() createChatDto: CreateChatDto, @CurrentUser() user: SafeUser) {
        return this.chatService.create(createChatDto, user['userId']);
    }

    @Get()
    findAll(@CurrentUser() user: SafeUser) {
        return this.chatService.findAll(user['userId']);
    }

    @Get(':id')
    find(@Param('id') id: string, @CurrentUser() user: SafeUser) {
        return this.chatService.findOne(user['userId'], id);
    }

    //
}
