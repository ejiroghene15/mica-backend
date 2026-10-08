import {IsEnum, IsOptional, IsString} from "class-validator";

export class CreateChatDto {
    @IsString()
    title: string;

    @IsString()
    preview: string;
}

export class ChatMessageDto {
    @IsString()
    text: string;

    @IsString()
    conversationId: string;

    @IsEnum(["user", "mica"])
    role?: "user" | "mica";
}
