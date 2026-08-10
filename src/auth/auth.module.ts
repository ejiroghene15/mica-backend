import {Module} from '@nestjs/common';
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {PrismaService} from "../common/services/prisma.service";
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./constants";
import {LocalStrategy} from "./local.strategy";
import {JwtStrategy} from "./jwt.strategy";

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '60s'},
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy],
})
export class AuthModule {
}
