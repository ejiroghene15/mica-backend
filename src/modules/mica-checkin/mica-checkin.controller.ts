import { Body, Controller, Post } from '@nestjs/common';
import { MicaCheckinService } from './mica-checkin.service';

@Controller('mica-checkin')
export class MicaCheckinController {
    constructor(
    private readonly micaCheckinService:  MicaCheckinService,
    private readonly logger: Logger,
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateWaitListSchema))
    createWaitListDto: CreateWaitListDto,
  ): Promise<IApiResponse> {
    const serviceResult = await this.waitListService.joinWaitList(
      createWaitListDto.email,
    );
    if (!serviceResult.success) {
      this.logger.log(`Wait list unsuccessful: ${createWaitListDto.email}`);
      return buildResponse(
        false,
        serviceResult.message || 'Failed to join wait list',
      );
    }
    return buildResponse(
      true,
      'Account created successfully. Verification email dispatched.',
      { emailStatus: serviceResult.message },
    );
  }
}
