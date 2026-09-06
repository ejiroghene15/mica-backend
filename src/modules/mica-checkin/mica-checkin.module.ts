import { Module } from '@nestjs/common';
import { MicaCheckinController } from './mica-checkin.controller';
import { MicaCheckinService } from './mica-checkin.service';

@Module({
  controllers: [MicaCheckinController],
  providers: [MicaCheckinService]
})
export class MicaCheckinModule {}
