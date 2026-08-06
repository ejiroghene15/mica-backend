import {Body, Controller, Post} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {AuthService} from "./auth.service";
import {SignupDto} from "../dto/signup.dto";

@Controller('auth')
export class AuthController {
    constructor(public prisma: PrismaService, public authService: AuthService) {
    }

    @Post("register")
    signup(@Body() signupDto: SignupDto): object {
        return this.authService.signup(signupDto)
    }
}
