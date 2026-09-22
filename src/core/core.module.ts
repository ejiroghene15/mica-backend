import {Global, Module} from '@nestjs/common';
import {PrismaService} from "./services/prisma.service";
import {MailModule} from "../mail/mail.module";
import {BullModule} from "@nestjs/bullmq";
import {ThrottlerModule} from "@nestjs/throttler";
import {CacheModule} from "@nestjs/cache-manager";

@Global()
@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: process.env.REDIS_HOST ?? 'localhost',
                port: Number(process.env.REDIS_PORT ?? 6379),
            },
        }),

        ThrottlerModule.forRoot({
            throttlers: [{
                ttl: 60000,
                limit: 10
            }]
        }),

        CacheModule.register(),

        MailModule
    ],
    providers: [PrismaService],
    exports: [PrismaService]
})
export class CoreModule {
}
