import {Body, Controller, Get, Post} from '@nestjs/common';
import {PrismaService} from "./service/prisma.service";
import {AuthService} from "./service/auth.service";
import {SignupDto} from "./dto/signup.dto";

@Controller()
export class AppController {
    constructor(public prisma: PrismaService, public authService: AuthService) {
    }

    @Get("users")
    user(): object {
        return this.prisma.user.findMany();
    }

    @Post("signup")
    signup(@Body() signupDto: SignupDto): object {
        return this.authService.signup(signupDto)
    }

}
