import { IsEnum, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export const Emotion = {
  GOOD : 'good',
  JOYFUL : 'joyful',
  CALM : 'calm',
  TENDER : 'tender',
  REST : 'rest',
  HEAVY : 'heavy',

} as const ;

export const Category ={
  WORK : 'work',
  RELATIONSHIPS : 'relationships',
  HEALTH : 'health',
  MONEY : 'money',
  REST : 'rest',
  MYSELF : 'myself',

} as const ;

export class CreateLayerDto {
  @IsEnum(Emotion)
  emotion: Emotion;

  @IsInt()
  @Min(0)
  @Max(100)
  intensity: number;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsString()
  note?: string;
}
