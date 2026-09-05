import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {ThrottlerGuard} from "@nestjs/throttler";
import {AuthModule} from './auth/auth.module';
import {APP_GUARD} from "@nestjs/core";
import {UsersModule} from './users/users.module';
import {CoreModule} from './core/core.module';
import { JournalModule } from './journal/journal.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        CoreModule,
        AuthModule,
        UsersModule,
        JournalModule,
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
