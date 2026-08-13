import {Controller, Get, UseGuards} from '@nestjs/common';
import {PrismaService} from "../core/services/prisma.service";
import {CurrentUser} from "../common/decorators/current-user.decorator";
import {JwtAuthGuard} from "../auth/jwt.strategy";
import {UserService} from "./user.service";

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(public userService: UserService) {
    }

    @Get('me')
    profile(@CurrentUser() user): object {
        return this.userService.profile(user.id);
    }
}
