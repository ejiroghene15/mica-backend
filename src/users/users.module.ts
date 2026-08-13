import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import {PrismaService} from "../core/services/prisma.service";
import { UserService } from './user.service';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, UserService]
})
export class UsersModule {}
