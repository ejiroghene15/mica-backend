import {Controller} from '@nestjs/common';
import {PrismaService} from "./core/services/prisma.service";

@Controller()
export class AppController {
    constructor(public prisma: PrismaService) {}
}
