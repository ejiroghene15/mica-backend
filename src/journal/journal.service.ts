import {Injectable} from '@nestjs/common';
import {CreateJournalDto} from './dto/create-journal.dto';
import {UpdateJournalDto} from './dto/update-journal.dto';
import {PrismaService} from "../core/services/prisma.service";
import {PaginationDto} from "../common/utils/pagination.dto";

@Injectable()
export class JournalService {
    selectedFields = {
        id: true,
        body: true,
        mood: true,
        createdAt: true,
        updatedAt: true
    }

    constructor(private prisma: PrismaService) {
    }

    create(createJournalDto: CreateJournalDto, userId: string) {
        return this.prisma.journalEntry.create({
            data: {
                body: createJournalDto.body,
                mood: createJournalDto.mood,
                userId: userId
            }, select: this.selectedFields
        })
    }

    async findAll(userId: string, paginationDto: PaginationDto) {
        const {page, limit} = paginationDto;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.journalEntry.findMany({
                skip,
                take: limit,
                where: {userId: userId},
                select: this.selectedFields,
                orderBy: {createdAt: 'desc'}
            }),
            this.prisma.journalEntry.count({where: {userId: userId}}),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    findOne(id: string, userId: string) {
        return this.prisma.journalEntry.findUnique({where: {id, userId}, select: this.selectedFields})
    }

    update(id: string, updateJournalDto: UpdateJournalDto, userId: string) {
        return this.prisma.journalEntry.update({
            where: {id},
            data: {
                body: updateJournalDto.body,
                mood: updateJournalDto.mood,
                userId: userId
            }, select: this.selectedFields
        })
    }

    async remove(id: string, userId: string) {
        try {
            await this.prisma.journalEntry.delete({where: {id, userId}});
            return {message: "Entry removed"}
        } catch (e) {
            return {message: "Entry not found"}
        }
    }

    getPrompts() {
        return this.prisma.journalPrompt.findMany({select: {id: true, text: true}})
    }

    addNewPrompt(text: string) {
        return this.prisma.journalPrompt.create({data: {text}, select: {id: true, text: true}})
    }
}
