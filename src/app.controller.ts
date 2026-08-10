import {Controller} from '@nestjs/common';
import {PrismaService} from "./common/services/prisma.service";

@Controller()
export class AppController {
    constructor(public prisma: PrismaService) {}
}
