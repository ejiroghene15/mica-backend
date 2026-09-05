import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {JournalService} from './journal.service';
import {CreateJournalDto} from './dto/create-journal.dto';
import {UpdateJournalDto} from './dto/update-journal.dto';
import {CurrentUser} from "../common/decorators/current-user.decorator";
import {JwtAuthGuard} from "../auth/jwt.strategy";
import {PaginationDto} from "../common/utils/pagination.dto";

@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
    constructor(private readonly journalService: JournalService) {
    }

    @Post()
    create(@Body() createJournalDto: CreateJournalDto, @CurrentUser() user) {
        return this.journalService.create(createJournalDto, user.userId);
    }

    @Get()
    findAll(@CurrentUser() user, @Query() paginationDto: PaginationDto) {
        return this.journalService.findAll(user.userId, paginationDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() user) {
        return this.journalService.findOne(id, user.userId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateJournalDto: UpdateJournalDto, @CurrentUser() user) {
        return this.journalService.update(id, updateJournalDto, user.userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user) {
        return this.journalService.remove(id, user.userId);
    }
}
