import { Test, TestingModule } from '@nestjs/testing';
import { MicaCheckinService } from './mica-checkin.service';
import { LayerRepository } from './entites/mica-checkin-repo';

describe('MicaCheckinService', () => {
  let service: MicaCheckinService;
  let layerRepository: {
    countByUser: jest.Mock;
    groupByEmotion: jest.Mock;
  };

  beforeEach(async () => {
    layerRepository = {
      countByUser: jest.fn(),
      groupByEmotion: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicaCheckinService,
        { provide: LayerRepository, useValue: layerRepository },
      ],
    }).compile();

    service = module.get<MicaCheckinService>(MicaCheckinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns the total layer count and emotion breakdown for a user', async () => {
    layerRepository.countByUser.mockResolvedValue(3);
    layerRepository.groupByEmotion.mockResolvedValue([
      { emotion: 'calm', _count: { _all: 2 } },
      { emotion: 'joy', _count: { _all: 1 } },
    ]);

    const result = await service.getAggregate('user-123');

    expect(layerRepository.countByUser).toHaveBeenCalledWith('user-123');
    expect(layerRepository.groupByEmotion).toHaveBeenCalledWith('user-123');
    expect(result).toEqual({
      success: true,
      message: 'Aggregate retrieved successfully',
      data: {
        totalLayers: 3,
        breakdown: [
          { emotion: 'calm', color: '#8FB8A8', count: 2 },
          { emotion: 'joy', color: '#F2C14E', count: 1 },
        ],
      },
    });
  });
});
