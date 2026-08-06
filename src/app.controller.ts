import {Controller} from '@nestjs/common';
import {PrismaService} from "./prisma.service";

@Controller()
export class AppController {
    constructor(public prisma: PrismaService) {}
}
