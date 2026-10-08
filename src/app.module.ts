import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {ThrottlerGuard} from "@nestjs/throttler";
import {AuthModule} from './auth/auth.module';
import {APP_GUARD} from "@nestjs/core";

import {CoreModule} from './core/core.module';
import {JournalModule} from './journal/journal.module';
import {ChatModule} from "./chat/chat.module";
import {HealthModule} from './health/health.module';
import {MicaCheckinModule} from './modules/mica-checkin/mica-checkin.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        CoreModule,
        AuthModule,

        MicaCheckinModule,


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
