import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {ThrottlerGuard} from "@nestjs/throttler";
import {AuthModule} from './modules/auth/auth.module';
import {APP_GUARD} from "@nestjs/core";

import {CoreModule} from './core/core.module';
import {JournalModule} from './modules/journal/journal.module';
import {ChatModule} from "./modules/chat/chat.module";
import {HealthModule} from './modules/health/health.module';
import {MicaCheckinModule} from './modules/mica-checkin/mica-checkin.module';
import {UsersModule} from "./modules/users/users.module";
import {LibraryModule} from "./modules/mica-library/library/library.module";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        CoreModule,
        AuthModule,
        MicaCheckinModule,
        LibraryModule,
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
