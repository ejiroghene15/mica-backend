import {IsBoolean, IsNotEmpty, IsString} from "class-validator";

export class UserProfileDto {
    @IsNotEmpty()
    @IsString()
    name: string
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