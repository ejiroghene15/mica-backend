import {Module} from '@nestjs/common';
import {ChatService} from './chat.service';
import {ChatGateway} from './chat.gateway';
import {ChatController} from './chat.controller';
import {JwtService} from "@nestjs/jwt";
import {AiService} from "../../common/services/ai.service";

@Module({
    providers: [ChatGateway, ChatService, JwtService, AiService],
    controllers: [ChatController],
})
export class ChatModule {
}
