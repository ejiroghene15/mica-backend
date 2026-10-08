import {IsBoolean, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UserProfileDto {
    @IsNotEmpty()
    @IsString()
    name: string
}

export class UserResponseDto {
    name: string

    email: string

    @IsOptional()
    avatarUrl: string | null
}

export class UserSettingsDto {
    @IsBoolean()
    dailyCheckin: boolean

    @IsBoolean()
    journalPrompt: boolean

    @IsBoolean()
    appLock: boolean

    @IsBoolean()
    hidePreviews: boolean
}