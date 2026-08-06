import {BadGatewayException, Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma.service";
import {SignupDto} from "../dto/signup.dto";

@Injectable()
export class AuthService {
    constructor(public prisma: PrismaService) {
    }

    async signup(SignupDto: SignupDto): Promise<object> {
        try {
            // let user = await this.prisma.user.create({data: SignupDto, select: {id: true, name: true, email: true}});

            // if (!user) new BadGatewayException("User not created");

            // return user
        } catch (error) {
            // throw new BadGatewayException("An error occurred while creating the user: ")
        }
    }
}