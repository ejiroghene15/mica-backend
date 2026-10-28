// dto/reset-password.dto.ts
import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

export class SignupDto {
    @IsString()
    @MinLength(4)
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;
}

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}

export class ForgotPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    token: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    newPassword: string;

    @IsString()
    @MinLength(6)
    confirmPassword: string;
}

export class RefreshTokenDto {
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}

export class ResendVerificationDto {
    @IsNotEmpty()
    @IsString()
    email: string;
}

export class VerifyAccountDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    token: string;
}
