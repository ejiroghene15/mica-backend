// src/mica-checkin/mica-checkin.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { IApiResponse, buildResponse } from './interfaces/api-response.interface';
import { LayerRepository } from '../mica-checkin/entites/mica-checkin-repo';
import { CreateLayerDto } from './dto/create-layer.dto';
import { formatEmotionBreakdown } from 'src/common/utils/helperFn';
// import { StreakService } from './streak.service';

const RANGE_TO_DAYS: Record<string, number> = {
  day: 1,
  week: 7,
  month: 30,
};


@Injectable()
export class MicaCheckinService {
  private readonly logger = new Logger(MicaCheckinService.name);

  constructor(
    private readonly layerRepository: LayerRepository,
    // private readonly streakService: StreakService,
  ) {}
  async createLayer(userId: string, dto: CreateLayerDto): Promise<IApiResponse> {
    const layer = await this.layerRepository.create({
     userId,
      emotion: dto.emotion,
      intensity: dto.intensity,
      category: dto.category,
      note: dto.note,
    });

    if (!layer) {
      this.logger.error(`Failed to store layer for user: ${userId}`);
      throw new BadRequestException('Failed to create check-in');
    }

    this.logger.log(`Layer created for user ${userId}: ${layer.id}`);
    return buildResponse(true, 'Check-in created successfully', layer);
  }

  // Total layers and breakdown by emotion for a user
  async getAggregate(userId: string): Promise<IApiResponse> {
    const [totalLayers, grouped] = await Promise.all([
      this.layerRepository.countByUser(userId),
      this.layerRepository.groupByEmotion(userId),
    ]);

    const breakdown = formatEmotionBreakdown(grouped);

    return buildResponse(true, 'Aggregate retrieved successfully', {
      totalLayers,
      breakdown,
    });
  }


async getRecentLayers(userId: string, range: 'week' | 'month' | 'all'): Promise<IApiResponse> {
  const since = this.resolveRangeStart(range);

  const layers = await this.layerRepository.findByUser(userId);

  const formatted = layers.map((layer: any) => ({
    id: layer.id,
    emotion: layer.emotion,
    noteSnippet: this.buildNoteSnippet(layer.note),
    date: layer.createdAt,
  }));

  return buildResponse(true, 'Recent layers retrieved successfully', {
    range,
    count: formatted.length,
    layers: formatted,
  });
}

private resolveRangeStart(range: 'week' | 'month' | 'all'): Date | null {
  const now = new Date();

  if (range === 'week') {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return start;
  }

  if (range === 'month') {
    const start = new Date(now);
    start.setMonth(start.getMonth() - 1);
    return start;
  }

  return null; // 'all' — no lower bound
}

private buildNoteSnippet(note: string | null, maxLength = 60): string | null {
  if (!note) return null;
  return note.length > maxLength ? `${note.slice(0, maxLength).trim()}…` : note;
}
}