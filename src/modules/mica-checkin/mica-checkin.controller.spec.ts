import { Test, TestingModule } from '@nestjs/testing';
import { MicaCheckinController } from './mica-checkin.controller';

describe('MicaCheckinController', () => {
  let controller: MicaCheckinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MicaCheckinController],
    }).compile();

    controller = module.get<MicaCheckinController>(MicaCheckinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
