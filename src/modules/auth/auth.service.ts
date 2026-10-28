import {
    BadGatewayException,
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException
} from "@nestjs/common";
import {PrismaService} from "../../core/services/prisma.service";
import {ResetPasswordDto, SignupDto, VerifyAccountDto} from "./auth.dto";
import {JwtService} from "@nestjs/jwt";
import {GenerateVerificationToken, HashToken} from "../../common/utils/password-hash";
import bcrypt from "bcrypt";
import {jwtConstants} from "./constants";
import {MailService} from "../../mail/mail.service";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        public mailService: MailService,
        private readonly configService: ConfigService
    ) {
    }

    async register(SignupDto: SignupDto): Promise<object> {
        const existing = await this.prisma.user.findUnique({where: {email: SignupDto.email}})

        if (existing) throw new ConflictException("An account with this email address already exists")

        try {
            SignupDto.password = await HashToken(SignupDto.password)

            // * Construct the payload for verification
            const {
                verification_token,
                date_expires,
                verification_link
            } = this.accountVerificationParams(SignupDto.email)

            await this.prisma.user.create({
                data: {
                    name: SignupDto.name,
                    email: SignupDto.email,
                    password: SignupDto.password,
                    emailVerificationToken: verification_token,
                    emailVerificationExpiry: date_expires,
                },
                select: {id: true, name: true, email: true}
            })

            // Send welcome email after successful registration
            await this.mailService.sendWelcomeEmail({
                name: SignupDto.name,
                email: SignupDto.email,
                verificationUrl: verification_link
            });

            return {message: "Registration successful. Please check your email to verify your account."}
        } catch (error) {
            throw new BadGatewayException("An error occurred while creating the user: " + error.message)
        }
    }

    async resendVerification(email: string) {
        const user = await this.prisma.user.findUnique({where: {email: email}})

        if (!user) throw new NotFoundException("User not found")

        if (user.emailVerified) return {message: "This email is already verified"}

        // * Construct the payload for verification
        const {
            verification_token,
            date_expires,
            verification_link
        } = this.accountVerificationParams(email, 15)

        // * Update the verification token and date_expires
        await this.prisma.user.update({
            where: {email: email},
            data: {emailVerificationToken: verification_token, emailVerificationExpiry: date_expires}
        })

        // Resend email verification
        await this.mailService.resendVerificationMail({
            name: user.name,
            email: user.email,
            verificationUrl: verification_link
        });

        return {message: "Verification email sent. Please check your inbox or spam folder"}
    }

    accountVerificationParams(email: string, time: number = 30) {
        const verification_token = GenerateVerificationToken()
        const date_expires = new Date(Date.now() + time * 60 * 1000) // Set to 30 minutes default

        const verification_link = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${verification_token}&email=${encodeURI(email)}`;

        return {verification_token, date_expires, verification_link}
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {email},
            select: {id: true, password: true, email: true, role: true, emailVerified: true}
        })

        if (!user) return null

        const isPasswordValid = await bcrypt.compare(password, user["password"]);
        if (!isPasswordValid) {
            return null;
        }
        const {password: _, ...safeUser} = user;
        return safeUser;
    }

    async login(user: any) {
        const tokens = await this.generateTokens(user);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.prisma.user.findUnique({where: {id: userId}});

        if (!user || !user.refreshToken) {
            throw new BadGatewayException("Access Denied");
        }

        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isRefreshTokenValid) {
            throw new BadGatewayException("Access Denied");
        }

        return this.login(user)
    }

    async logout(userId: string): Promise<string> {
        await this.prisma.user.update({
            where: {id: userId},
            data: {refreshToken: null},
        });
        return "Successfully logged out";
    }

    async forgotPassword(email: string) {
        const user = await this.prisma.user.findUnique({where: {email}});

        const genericResponse = {
            message: 'If an account with that email exists, a reset link will be sent.',
        };

        if (!user) {
            return genericResponse;
        }

        // Generate a random raw token — sent to the user, never stored as-is
        const rawToken = GenerateVerificationToken();
        const hashedToken = await HashToken(rawToken);

        await this.prisma.user.update({
            where: {id: user.id},
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 min
            },
        });

        const name = user.name;
        const resetLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${rawToken}&email=${email}`;
        await this.mailService.sendPasswordResetEmail(name, email, resetLink); // your email provider

        return genericResponse;
    }

    async resetPassword(dto: ResetPasswordDto) {
        const user = await this.prisma.user.findUnique({where: {email: dto.email}});

        if (!user || !user.resetPasswordToken || !user.resetPasswordExpiry) {
            throw new BadRequestException('This token is invalid or has already been used');
        }

        if (user.resetPasswordExpiry < new Date()) {
            throw new BadRequestException('Reset token has expired');
        }

        const tokenMatches = await bcrypt.compare(dto.token, user.resetPasswordToken);

        if (!tokenMatches) {
            throw new BadRequestException('Invalid token');
        }

        if (dto.newPassword !== dto.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const hashedPassword = await HashToken(dto.newPassword);

        await this.prisma.user.update({
            where: {id: user.id},
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpiry: null,
                refreshToken: null,
            },
        });

        return {message: 'Password reset successfully'};
    }

    async verifyAccount(dto: VerifyAccountDto) {
        const user = await this.prisma.user.findUnique({where: {email: dto.email, emailVerificationToken: dto.token}});

        if (!user) {
            throw new BadRequestException('Account not found');
        }

        if (user.emailVerified) {
            return {message: 'Account already verified'};
        }

        if (!user.emailVerificationToken || !user.emailVerificationExpiry) {
            throw new BadRequestException('This token is invalid or has already been used');
        }

        if (user.emailVerificationExpiry < new Date()) {
            throw new BadRequestException('This link has expired');
        }

        await this.prisma.user.update({
            where: {id: user.id},
            data: {
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpiry: null,
            },
        });

        return {message: 'Email verified successfully'};
    }

    private async generateTokens(user: { id: string, email: string, role: string }) {
        const payload: any = {sub: user.id, email: user.email, role: user.role};

        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: jwtConstants.secret,
                expiresIn: '1d',
            }),
            this.jwtService.signAsync(payload, {
                secret: jwtConstants.refresh_secret, // different secret from access token
                expiresIn: '7d',
            }),
        ]);

        return {access_token, refresh_token};
    }

    private async updateRefreshTokenHash(userId: string, refreshToken: string) {
        const hash = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: {id: userId},
            data: {refreshToken: hash},
        });
    }
}