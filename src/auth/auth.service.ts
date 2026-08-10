import {BadGatewayException, ConflictException, Injectable} from "@nestjs/common";
import {PrismaService} from "../common/services/prisma.service";
import {SignupDto} from "./dto/signup.dto";
import {JwtService} from "@nestjs/jwt";
import {HashPassword} from "../common/utils/password-hash";
import bcrypt from "bcrypt";
import {env} from "prisma/config";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {
    }

    async register(SignupDto: SignupDto): Promise<object> {
        const existing = await this.prisma.user.findUnique({where: {email: SignupDto.email}})

        if (existing) {
            throw new ConflictException("User with this email already exists")
        }

        try {
            SignupDto.password = await HashPassword(SignupDto.password)
            return await this.prisma.user.create({data: SignupDto, select: {id: true, name: true, email: true}})
        } catch (error) {
            throw new BadGatewayException("An error occurred while creating the user: ")
        }

    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {email},
            select: {id: true, password: true, email: true}
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
        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
        return tokens;
    }

    private async generateTokens(userId: string, email: string) {
        const payload = {sub: userId, email};

        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: env('JWT_ACCESS_SECRET'),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: env('JWT_REFRESH_SECRET'), // different secret from access token
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

    public async refreshTokens(userId: string, refreshToken: string) {
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
        console.log(userId)
        await this.prisma.user.update({
            where: {id: userId},
            data: {refreshToken: null},
        });
        return "Successfully logged out";
    }

    forgotPassword(email: string) {
        return Promise.resolve(undefined);
    }

    resetPassword(token: string, newPassword: string) {
        return Promise.resolve(undefined);
    }
}