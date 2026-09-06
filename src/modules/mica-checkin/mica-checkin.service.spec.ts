import { Test, TestingModule } from '@nestjs/testing';
import { MicaCheckinService } from './mica-checkin.service';

describe('MicaCheckinService', () => {
  let service: MicaCheckinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MicaCheckinService],
    }).compile();

    service = module.get<MicaCheckinService>(MicaCheckinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
