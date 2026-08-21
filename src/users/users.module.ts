import {Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {PrismaService} from "../core/services/prisma.service";
import {UserService} from './user.service';
import {SupabaseService} from "../common/services/supabase.service";

@Module({
    controllers: [UsersController],
    providers: [PrismaService, UserService, SupabaseService]
})
export class UsersModule {
}
