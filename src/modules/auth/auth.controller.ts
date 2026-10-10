import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {ForgotPasswordDto, ResetPasswordDto, SignupDto} from "./auth.dto";
import {LocalAuthGuard} from "./local.strategy";
import {JwtRefreshAuthGuard} from "./jwt-refresh.strategy";
import {JwtAuthGuard} from "./jwt.strategy";

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

    @UseGuards(JwtRefreshAuthGuard)
    @Post("refresh")
    refresh(@Req() req): object {
        return this.authService.refreshTokens(req.user.userId, req.user.refreshToken)
    }

    @UseGuards(JwtAuthGuard)
    @Post("logout")
    async logout(@Req() req) {
        return await this.authService.logout(req.user.userId)
    }

    @Post("forgot-password")
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto.email)
    }

    @Post("reset-password")
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto)
    }
}
