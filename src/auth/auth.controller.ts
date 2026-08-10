import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {SignupDto} from "./dto/signup.dto";
import {AuthGuard} from "@nestjs/passport";

@Controller('auth')
export class AuthController {
    constructor(public authService: AuthService) {
    }

    @UseGuards(AuthGuard('local'))
    @Post("login")
    async login(@Req() req): Promise<object> {
        return this.authService.login(req.user)
    }

    @Post("register")
    signup(@Body() signupDto: SignupDto): object {
        return this.authService.register(signupDto)
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post("refresh")
    refresh(@Req() req): object {
        return this.authService.refreshTokens(req.user.id, req.user.refreshToken)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post("logout")
    async logout(@Req() req) {
        return await this.authService.logout(req.user.userId)
    }

    @Post("forgot-password")
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email)
    }

    @Post("reset-password")
    async resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string) {
        return this.authService.resetPassword(token, newPassword)
    }
}
