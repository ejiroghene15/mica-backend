import {BadGatewayException, ConflictException, Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.service";
import {SignupDto} from "../dto/signup.dto";
import {JwtService} from "@nestjs/jwt";
import {HashPassword} from "../utils/password-hash";
import bcrypt from "bcrypt";

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
        const payload = {email: user.email, sub: user.id};
        return {access_token: this.jwtService.sign(payload),};
    }
}