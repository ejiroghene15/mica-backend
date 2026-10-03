import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/shared/base.repository';
import { PrismaService } from '../../core/services/prisma.service';
import { QueryResourceDto } from '../dto/query-resource.dto';

@Injectable()
export class ResourceRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma.resource);
  }

  async findFiltered(query: QueryResourceDto) {
    const { kind, category, search, featured, page = 1, limit = 10 } = query;

    const where: any = {};
    if (kind) where.kind = kind;
    if (category) where.category = category;
    if (featured !== undefined) where.featured = featured;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.delegate.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { featured: 'desc' },
      }),
      this.delegate.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  findBySlug(slug: string) {
    return this.delegate.findUnique({ where: { slug } });
  }
}