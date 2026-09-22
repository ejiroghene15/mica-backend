// src/mica-checkin/entities/layer-repo.ts
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/shared/baseRepsitory';
import {  Prisma } from '../../../../generated/prisma/client';

import { PrismaService } from 'src/core/services/prisma.service';

@Injectable()
export class LayerRepository extends BaseRepository {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.layers);
  }

  findByUser(userId: string) {
    return this.delegate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findCheckInDatesForUser(userId: string) {
    return this.delegate.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  countByUser(userId: string) {
    return this.delegate.count({ where: { userId } });
  }

  groupByEmotion(userId: string) {
    return this.delegate.groupBy({
      by: ['emotion'],
      where: { userId },
      _count: { _all: true },
    });
  }

  countTotalForUser(userId: string) {
    return this.delegate.count({ where: { userId } });
  }


}