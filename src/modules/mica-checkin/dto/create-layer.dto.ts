import {
  IsEnum,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { MoodKey, Category } from '../../../../generated/prisma/enums';
import { z } from 'zod';

export class CreateLayerDto {
  @IsEnum(MoodKey, {
    groups: ['step1'],
    message: 'emotion must be one of the defined emotions',
  })
  emotion!: MoodKey;

  @IsInt({ groups: ['step2'] })
  @Min(0, { groups: ['step2'] })
  @Max(100, { groups: ['step2'] })
  intensity!: number;

  @IsOptional()
  @IsEnum(Category, {
    groups: ['step2'],
    message: 'category must be one of the defined categories',
  })
  category?: Category;

  @IsOptional()
  @IsString({ groups: ['step3'] })
  @MaxLength(500, { groups: ['step3'] })
  note?: string;
}

// zod schema for CreateLayerDto
export const CreateCheckInsSchema = z.object({
    category: z.nativeEnum(Category).optional(),
    emotion: z.nativeEnum(MoodKey),
    intensity: z.number().min(0, 'Intensity must be at least 0').max(100, 'Intensity must be at most 100'),
    note: z.string().max(500, 'Note must be at most 500 characters long').optional(),
});
export type CreateCheckInsDto = z.infer<typeof CreateCheckInsSchema>;