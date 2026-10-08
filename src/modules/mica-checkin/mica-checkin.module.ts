import { Module } from '@nestjs/common';
import { MicaCheckinController } from './mica-checkin.controller';
import { MicaCheckinService } from './mica-checkin.service';
import { LayerRepository } from './entites/mica-checkin-repo';
import { PrismaService } from 'src/core/services/prisma.service';

@Module({
  controllers: [MicaCheckinController],
  providers: [MicaCheckinService,
    LayerRepository,
    PrismaService,]
})
export class MicaCheckinModule {}
