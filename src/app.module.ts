import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {ThrottlerGuard} from "@nestjs/throttler";
import {AuthModule} from './auth/auth.module';
import {APP_GUARD} from "@nestjs/core";

import {CoreModule} from './core/core.module';
import { MicaCheckinModule } from './modules/mica-checkin/mica-checkin.module';
import { LibraryModule } from './modules/mica-library/library/library.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        CoreModule,
        AuthModule,
        MicaCheckinModule,
         LibraryModule
        

    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ],
})
export class AppModule {
}
