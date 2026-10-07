import { Body, Controller, Get, Logger, Post, Query, UseGuards } from '@nestjs/common';
import { MicaCheckinService } from './mica-checkin.service';
import { CreateCheckInsSchema } from './dto/create-layer.dto';
import type { CreateCheckInsDto } from './dto/create-layer.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { buildResponse, IApiResponse } from './interfaces/api-response.interface';
import { JwtAuthGuard } from 'src/auth/jwt.strategy';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
@Controller('mica-checkin')
export class MicaCheckinController {
    private readonly logger = new Logger(MicaCheckinController.name);
    constructor(
    private readonly micaCheckinService: MicaCheckinService,
  ) {}
// @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    // @CurrentUser('userId') userId: string,
    @Body(new ZodValidationPipe(CreateCheckInsSchema))
    createCheckInsDto: CreateCheckInsDto,
  ): Promise<IApiResponse> {
    this.logger.log(1, `Received check-in request from user ${createCheckInsDto}`, );
 const userId = 'cmj8k2x4p0000v3l5g7h9q1ab'; // Replace with actual user ID from authentication
    const serviceResult = await this.micaCheckinService.createLayer(userId,
      createCheckInsDto
      ,
    );
    if (!serviceResult.success) { this.logger.log(1, `Check-in was unsuccessful: ${serviceResult.message}`, ); 
      return buildResponse( false, serviceResult.message || 'Failed to create check-in', ); }
      return buildResponse( true, 'Check-in created successfully', { checkin: serviceResult.message }, );
    }
@Get('/summary')
    async   getMicaSummary(@Query('userId') userId: string) {
  const serviceResult  = await this.micaCheckinService.getAggregate(userId);
  if(!serviceResult ){
    return buildResponse( false, "No result returned", {serviceResult})
  }
  return buildResponse( true, "Result returned",{serviceResult})
  }


  // @UseGuards(AuthGuard('jwt'))
  // @Get('layers')
  // async getRecentLayers(@Req() req: any, @Query() query: QueryRecentLayersDto) {
  //   const userId = req.user.id;
  //   return this.micaService.getRecentLayers(userId, query.range ?? 'week');
  // }
    }

