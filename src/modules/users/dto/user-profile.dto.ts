import {IsBoolean, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UserProfileDto {
    @IsNotEmpty()
    @IsString()
    name: string
}

export class UserResponseDto {
    name: string

    email: string

    joinedAt: Date

    streakDays: number

    @IsOptional()
    avatarUrl: string | null
}

export class UserSettingsDto {
    @IsBoolean()
    dailyCheckInReminder: boolean

    @IsBoolean()
    journalPromptReminder: boolean

    @IsBoolean()
    appLock: boolean

    @IsBoolean()
    hidePreviews: boolean
}