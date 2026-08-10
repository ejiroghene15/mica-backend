import {Controller, Get, UseGuards} from '@nestjs/common';
import {PrismaService} from "../common/services/prisma.service";
import {AuthGuard} from "@nestjs/passport";
import {CurrentUser} from "../common/decorators/current-user.decorator";

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
    constructor(public prisma: PrismaService) {
    }

    @Get('me')
    async profile(@CurrentUser() user): Promise<any> {
        const userProfile = await this.prisma.user.findUnique({
            where: {id: user.userId},
            omit: {password: true, refreshToken: true},
        });
        return userProfile;
    }
}
