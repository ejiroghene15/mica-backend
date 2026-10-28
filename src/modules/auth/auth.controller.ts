import {Body, Controller, Patch, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {ForgotPasswordDto, ResendVerificationDto, ResetPasswordDto, SignupDto, VerifyAccountDto} from "./auth.dto";
import {LocalAuthGuard} from "./local.strategy";
import {JwtRefreshAuthGuard} from "./jwt-refresh.strategy";
import {JwtAuthGuard} from "./jwt.strategy";
import {Throttle} from "@nestjs/throttler";


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

    // Set throttle limit to 2 requests per minute
    @Throttle({default: {limit: 2, ttl: 60000}})
    @Post('resend-verification')
    resendVerification(@Body() dto: ResendVerificationDto) {
        return this.authService.resendVerification(dto.email)
    }

    @Patch("verify-account")
    verify(@Body() dto: VerifyAccountDto) {
        return this.authService.verifyAccount(dto)
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
