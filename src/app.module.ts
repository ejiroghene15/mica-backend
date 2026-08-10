import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {PrismaService} from "./common/services/prisma.service";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {AuthModule} from './auth/auth.module';
import {APP_GUARD} from "@nestjs/core";
import { UsersModule } from './users/users.module';

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
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService, {
        provide: APP_GUARD,
        useClass: ThrottlerGuard
    }],
})
export class AppModule {
}
