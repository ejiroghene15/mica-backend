import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException
} from '@nestjs/websockets';
import {ChatService} from './chat.service';
import {Server, Socket} from "socket.io";
import {JwtService} from "@nestjs/jwt";
import {jwtConstants} from "../auth/constants";
import {ChatMessageDto} from "./dto/create-chat.dto";
import {AiService} from "../common/services/ai.service";

@WebSocketGateway({namespace: 'chat'})
export class ChatGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService, private jwt: JwtService, private aiService: AiService) {
    }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth?.token
                ?? client.handshake.headers.authorization?.split(' ')[1];

            if (!token) throw new WsException("Unauthorized: Invalid or missing token");

            const payload = this.jwt.verify(token, {
                secret: jwtConstants.secret,
            });

            // attach user to the socket for later use
            (client as any).user = {id: payload.sub, role: payload.role};
        } catch {
            client.disconnect(); // reject the connection outright
        }
    }

    @SubscribeMessage('joinConversation')
    async joinConversation(@MessageBody() conversationId: string, @ConnectedSocket() client: Socket) {
        const user = (client as any).user;
        // Here you would typically check if the user has access to the conversation
        // For simplicity, we assume they do
        client.join(conversationId);
        return {message: `Joined conversation ${conversationId}`};
    }

    @SubscribeMessage('sendMessage')
    async create(@MessageBody() dto: ChatMessageDto, @ConnectedSocket() client: Socket) {
        const user = (client as any).user;
        dto.role = user.role;
        await this.chatService.replyConversation(dto);
        this.server.to(dto.conversationId).emit('newMessage', dto);

        // 2. kick off the AI reply — don't await this in a way that blocks the ack
        this.generateAiReply(dto.conversationId).catch((err) => {
            this.server.to(dto.conversationId).emit('aiError', {
                message: 'The assistant failed to respond. Please try again.',
            });
        });
    }

    private async generateAiReply(conversationId: string) {
        const history = await this.chatService.getRecentHistoryForAi(conversationId);

        this.server.to(conversationId).emit('aiTyping', {conversationId}); // spinner/typing indicator

        let fullText = '';
        for await (const chunk of this.aiService.streamReply(history as any)) {
            fullText += chunk;
            this.server.to(conversationId).emit('aiChunk', {conversationId, chunk});
        }

        // persist only the complete message, once streaming is done
        const aiMessage = await this.chatService.replyConversation({
            conversationId,
            role: 'mica',
            text: fullText,
        });

        this.server.to(conversationId).emit('aiComplete', aiMessage);
    }
}
