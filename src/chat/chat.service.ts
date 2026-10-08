import {Injectable} from '@nestjs/common';
import {ChatMessageDto, CreateChatDto} from './dto/create-chat.dto';
import {PrismaService} from "../core/services/prisma.service";

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {
    }

    create(createChatDto: CreateChatDto, userId: string) {
        return this.prisma.conversation.create({
            data: {
                userId,
                title: createChatDto.title,
                preview: createChatDto.preview,
                messages: {
                    create: [
                        {role: 'user', text: createChatDto.preview},
                    ]
                }
            },

            omit: {userId: true}
        })
    }

    replyConversation(data: ChatMessageDto) {
        return this.prisma.chatMessage.create({
            data: {
                conversationId: data.conversationId,
                role: data.role ?? 'user',
                text: data.text
            }
        })
    }

    findAll(userId: string) {
        return this.prisma.conversation.findMany({
            where: {userId},
            select: {
                id: true,
                title: true,
                preview: true,
                updatedAt: true
            }
        })
    }

    findOne(userId: string, conversationId: string) {
        return this.prisma.conversation.findFirst({
            where: {userId, id: conversationId},
            select: {
                id: true,
                title: true,
                preview: true,
                updatedAt: true,
                messages: {
                    select: {
                        id: true,
                        role: true,
                        text: true,
                        createdAt: true
                    }
                }
            }
        })
    }

    async getRecentHistoryForAi(conversationId: string, limit = 20) {
        const messages = await this.prisma.chatMessage.findMany({
            where: {conversationId},
            take: -limit,
            select: {role: true, text: true},
        });

        return messages.map((m) => ({
            role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
            content: m.text,
        }));
    }

}
