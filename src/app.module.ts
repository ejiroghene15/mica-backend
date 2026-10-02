import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {ThrottlerGuard} from "@nestjs/throttler";
import {AuthModule} from './auth/auth.module';
import {APP_GUARD} from "@nestjs/core";
import {UsersModule} from './users/users.module';
import {CoreModule} from './core/core.module';
import {JournalModule} from './journal/journal.module';
import {ChatModule} from "./chat/chat.module";
import {HealthModule} from './health/health.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        CoreModule,
        AuthModule,
        UsersModule,
        JournalModule,
        ChatModule,
        HealthModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        },
    ],
})
export class AppModule {
}
