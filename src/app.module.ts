import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {PrismaService} from "./prisma.service";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {AuthModule} from './auth/auth.module';
import {APP_GUARD} from "@nestjs/core";

@Module({
    imports: [
        ConfigModule.forRoot(),
        AuthModule,
        ThrottlerModule.forRoot({
            throttlers: [{
                ttl: 60000,
                limit: 10
            }]
        }),
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService, {
        provide: APP_GUARD,
        useClass: ThrottlerGuard
    }],
})
export class AppModule {
}
