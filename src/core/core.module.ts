import {Global, Module} from '@nestjs/common';
import {PrismaService} from "./services/prisma.service";
import {MailModule} from "../mail/mail.module";
import {BullModule} from "@nestjs/bullmq";
import {ThrottlerModule} from "@nestjs/throttler";
import {CacheModule} from "@nestjs/cache-manager";
import KeyvRedis from "@keyv/redis";
import {env} from "prisma/config";

@Global()
@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: 'localhost',
                port: 6379,
            },
        }),

        ThrottlerModule.forRoot({
            throttlers: [{
                ttl: 60000,
                limit: 10
            }],
            errorMessage: 'Too many requests, please try again later.'
        }),

        CacheModule.register({
            stores: new KeyvRedis(env('REDIS_URL')),
            isGlobal: true,
        }),
        MailModule
    ],
    providers: [PrismaService],
    exports: [PrismaService]
})
export class CoreModule {
}
