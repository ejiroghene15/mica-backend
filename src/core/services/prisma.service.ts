import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {PrismaClient} from '../../../generated/prisma/client';
import {env} from 'prisma/config';
import {PrismaPg} from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(PrismaService.name);
    constructor() {
        const adapter = new PrismaPg({connectionString: env('DATABASE_URL')});
        new PrismaClient({adapter});
        super({
            adapter,
            omit: {
                user: {
                    password: true,
                    resetPasswordToken: true,
                    role: true
                }
            }
        });
    }

    async onModuleInit() {
    await this.$connect();
    this.logger.log(1,'✅ Database connected successfully');
  }
}
