import {Inject, Injectable} from '@nestjs/common';
import {PrismaService} from "../core/services/prisma.service";
import {Cache, CACHE_MANAGER} from "@nestjs/cache-manager";

@Injectable()
export class UserService {
    constructor(
        public prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
    }

    async profile(userId: string) {
        let userData = await this.cacheManager.get(`user:${userId}`);

        if (userData) return userData;

        userData = this.prisma.user.findUnique({
            where: {id: userId},
            omit: {password: true, refreshToken: true},
        });

        await this.cacheManager.set(`user:${userId}`, userData, 3600); // Cache for 1 hour

        return userData;
    }

    async updateProfile() {

    }
}
