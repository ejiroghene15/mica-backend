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


  // src/mica-checkin/mica.service.ts (add this method alongside getAggregate)

async getRecentLayers(userId: string, range: 'week' | 'month' | 'all'): Promise<IApiResponse> {
  const since = this.resolveRangeStart(range);

  const layers = await this.layerRepository.findRecentForUser(userId, since);

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
  // async getAggregate(userId: string): Promise<IApiResponse> {
  //   const total = await this.layerRepository.count({ userId });

  //   const grouped = await this.layerRepository['delegate']['groupBy']({
  //     by: ['emotion'],
  //     where: { userId },
  //     _count: { emotion: true },
  //   });

  //   const dates = await this.layerRepository.find({
  //     where: { userId },
  //     orderBy: { createdAt: 'desc' },
  //   });

  //   const breakdown = grouped.map((group: any) => ({
  //     emotion: group.emotion,
  //     color: EMOTION_COLOR_MAP[group.emotion as keyof typeof EMOTION_COLOR_MAP],
  //     count: group._count.emotion,
  //   }));

  //   const streak = this.streakService.calculateStreak(dates.map((d: any) => d.createdAt));

  //   return buildResponse(true, 'Aggregate retrieved successfully', {
  //     totalLayers: total,
  //     breakdown,
  //     streak,
  //   });
  // }

  // async getRecentLayers(userId: string, query: GetLayersQueryDto): Promise<IApiResponse> {
  //   const days = RANGE_TO_DAYS[query.range] ?? 7;
  //   const since = new Date();
  //   since.setDate(since.getDate() - days);

  //   const layers = await this.layerRepository.find({
  //     where: { userId, createdAt: { gte: since } },
  //     orderBy: { createdAt: 'desc' },
  //   });

  //   const data = layers.map((layer: any) => ({
  //     id: layer.id,
  //     emotion: layer.emotion,
  //     noteSnippet: layer.note ? layer.note.slice(0, 80) : null,
  //     date: layer.createdAt,
  //   }));

  //   return buildResponse(true, 'Layers retrieved successfully', data);
  // }
}