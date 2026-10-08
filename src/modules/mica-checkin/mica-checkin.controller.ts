import {Body, Controller, Get, Logger, Post, Query, UseGuards} from '@nestjs/common';
import {MicaCheckinService} from './mica-checkin.service';
import type {CreateCheckInsDto} from './dto/create-layer.dto';
import {CreateCheckInsSchema} from './dto/create-layer.dto';
import type {QueryRecentLayersDto} from './dto/query-recent-layers.dto.ts';
import {ZodValidationPipe} from 'src/common/pipes/zod-validation.pipe';
import {buildResponse, IApiResponse} from './interfaces/api-response.interface';
import {JwtAuthGuard} from "../auth/jwt.strategy";
import {CurrentUser} from "../../common/decorators/current-user.decorator";
import type {AuthenticatedUser} from "../../common/types";

@Controller('mica-checkin')
@UseGuards(JwtAuthGuard)
export class MicaCheckinController {
    private readonly logger = new Logger(MicaCheckinController.name);

    constructor(
        private readonly micaCheckinService: MicaCheckinService,
    ) {
    }

    @Post()
    async create(
        @Body(new ZodValidationPipe(CreateCheckInsSchema))
        createCheckInsDto: CreateCheckInsDto,
        @CurrentUser() user: AuthenticatedUser
    ): Promise<IApiResponse> {
        this.logger.log(1, `Received check-in request from user ${createCheckInsDto}`,);
        const userId = user.userId; // Replace with actual user ID from authentication
        const serviceResult = await this.micaCheckinService.createLayer(userId,
            createCheckInsDto
            ,
        );
        if (!serviceResult.success) {
            this.logger.log(1, `Check-in was unsuccessful: ${serviceResult.message}`,);
            return buildResponse(false, serviceResult.message || 'Failed to create check-in',);
        }
        return serviceResult;
    }

    @Get('/summary')
    async getMicaSummary(@Query('userId') userId: string) {
        const serviceResult = await this.micaCheckinService.getAggregate(userId);
        if (!serviceResult) {
            return buildResponse(false, "No result returned", null);
        }
        return serviceResult
    }


    // @UseGuards(AuthGuard('jwt'))
    @Get('layers')
    async getRecentLayers(@Query() query: QueryRecentLayersDto, @CurrentUser() user: AuthenticatedUser) {
        const userId = user.userId; // TODO: replace with the authenticated user
        return this.micaCheckinService.getRecentLayers(userId, query.range ?? 'week');
    }
}
