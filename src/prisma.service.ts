import {Injectable} from '@nestjs/common';
import {PrismaClient} from './generated/prisma/client';
import {env} from 'prisma/config';
import {PrismaPg} from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const adapter = new PrismaPg({connectionString: env('DATABASE_URL')});
        new PrismaClient({adapter});
        super({adapter});
    }
}
