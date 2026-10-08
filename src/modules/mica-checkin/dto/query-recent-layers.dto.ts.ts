import { IsIn, IsOptional } from 'class-validator';

export class QueryRecentLayersDto {
  @IsOptional()
  @IsIn(['week', 'month', 'all'])
  range?: 'week' | 'month' | 'all';
}