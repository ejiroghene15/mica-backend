import { IsEnum, IsString, IsInt, Min, IsOptional, IsBoolean } from 'class-validator';
import { ResourceKind } from '../../../generated/prisma/client';

export class CreateResourceDto {
  @IsString()
  slug!: string;

  @IsString()
  title!: string;

  @IsEnum(ResourceKind)
  kind: ResourceKind;

  @IsInt()
  @Min(1)
  durationMin: number;

  @IsString()
  category: string;

  @IsString()
  excerpt: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}