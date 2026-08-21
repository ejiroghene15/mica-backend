import {BadGatewayException, Inject, Injectable} from '@nestjs/common';
import {PrismaService} from "../core/services/prisma.service";
import {Cache, CACHE_MANAGER} from "@nestjs/cache-manager";
import {UserProfileDto} from "./dto/user-profile.dto";
import {SupabaseService} from "../common/services/supabase.service";

@Injectable()
export class UserService {
    constructor(
        public prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        public supabase: SupabaseService
    ) {
    }

    async profile(userId: string) {
        const userCacheKey = `user:${userId}`;

        let userData = await this.cacheManager.get(userCacheKey);

        if (userData) return userData;

        userData = await this.prisma.user.findUnique({
            where: {id: userId},
            include: {
                settings: {
                    select: {
                        dailyCheckInReminder: true,
                        journalPromptReminder: true,
                        appLock: true,
                        hidePreviews: true
                    },
                },
            }
        });

        await this.cacheManager.set(userCacheKey, userData);

        return userData;
    }

    async updateProfile(user: any, dto: UserProfileDto, file: Express.Multer.File | undefined) {
        let avatarUrl: string | undefined = undefined;

        try {
            if (file) {
                const key = `${user.userId}.${file.originalname.split('.').pop()}`;
                avatarUrl = await this.supabase.uploadAvatar(file, key);
            }

            const updatedUser = await this.prisma.user.update({
                where: {id: user.userId},
                data: {
                    name: dto.name,
                    avatarUrl,
                },
                omit: {refreshToken: true},
            });

            // Invalidate the cache for this user
            await this.cacheManager.del(`user:${user.userId}`);

            return updatedUser;
        } catch (error) {
            throw new BadGatewayException("An error occurred while updating the profile: " + error.message);
        }
    }

    updateSettings(user, dto: any) {
        return this.prisma.settings.upsert({
            where: {userId: user.userId},
            update: {
                dailyCheckInReminder: dto.dailyCheckin,
                journalPromptReminder: dto.journalPrompt,
                appLock: dto.appLock,
                hidePreviews: dto.hidePreviews
            },
            create: {
                userId: user.userId,
                dailyCheckInReminder: dto.dailyCheckin,
                journalPromptReminder: dto.journalPrompt,
                appLock: dto.appLock,
                hidePreviews: dto.hidePreviews,
            }
        });
    }
}
