import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AdminModule} from './admin/admin.module';
import {ConfigModule} from "@nestjs/config";
import {PrismaService} from "./prisma.service";
import {AuthService} from "./auth/auth.service";
import { AuthController } from './auth/auth.controller';

@Module({
    imports: [AdminModule, ConfigModule.forRoot()],
    controllers: [AppController, AuthController],
    providers: [AppService, AuthService, PrismaService],
})
export class AppModule {
}
