import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {SignupDto} from "../dto/signup.dto";
import {LocalAuthGuard} from "./local-auth-guard";

@Controller('auth')
export class AuthController {
    constructor(public authService: AuthService) {
    }

    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Req() req): Promise<object> {
        return this.authService.login(req.user)
    }

    @Post("register")
    signup(@Body() signupDto: SignupDto): object {
        return this.authService.register(signupDto)
    }
}
