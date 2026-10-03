import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LibraryService } from './library.service';
import { QueryResourceDto } from '../dto/query-resource.dto';
import { buildResponse } from 'src/modules/mica-checkin/interfaces/api-response.interface';
@Controller('library')
export class LibraryController {
     constructor(private readonly libraryService: LibraryService) {}
  @Get()
 async  findAll(@Query() query: QueryResourceDto) {
 const serviceResult = await this.libraryService.findAll(query);
    return buildResponse(true, 'Resources retrieved successfully', serviceResult);
  }
}
