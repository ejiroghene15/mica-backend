// dto/reset-password.dto.ts
import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

export class SignupDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
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
    @IsString()
    token: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6)
    newPassword: string;
}

export class RefreshTokenDto {
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}