import {IsEnum, IsNotEmpty, IsString, MinLength} from "class-validator";
import {Mood} from "../../common/types";

export class CreateJournalDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5, {message: 'Journal entry is too short'})
    body: string

    @IsEnum(Mood, {message: 'Mood must be one of: growth, joy, calm, tender, rest, heavy'})
    mood: Mood
}

export class CreatePromptDto {
    @IsNotEmpty()
    @IsString({message: 'Prompt text must be a string'})
    text: string
}