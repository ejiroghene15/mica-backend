import {BadGatewayException, Inject, Injectable} from '@nestjs/common';
import {PrismaService} from "../core/services/prisma.service";
import {Cache, CACHE_MANAGER} from "@nestjs/cache-manager";
import {UserProfileDto, UserResponseDto} from "./dto/user-profile.dto";
import {SupabaseService} from "../common/services/supabase.service";

@Injectable()
export class UserService {
    constructor(
        public prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        public supabase: SupabaseService
    ) {
    }

    async profile(userId: string): Promise<UserResponseDto> {
        const userCacheKey = `user:${userId}`;

        let userData = await this.cacheManager.get<UserResponseDto>(userCacheKey);

        if (userData) return userData;

        const user = await this.prisma.user.findUnique({
            where: {id: userId},
            select: {name: true, email: true, avatarUrl: true, joinedAt: true, streakDays: true},
        });

        if (!user) {
            throw new BadGatewayException("User not found");
        }

        const response: UserResponseDto = {
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            joinedAt: user.joinedAt,
            streakDays: user.streakDays
        };

        await this.cacheManager.set(userCacheKey, response);

        return response;
    }

    async updateProfile(user: any, dto: UserProfileDto, file: Express.Multer.File | undefined): Promise<UserResponseDto> {
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
                select: {name: true, email: true, avatarUrl: true, joinedAt: true, streakDays: true},
            });

            const response: UserResponseDto = {
                name: updatedUser.name,
                email: updatedUser.email,
                avatarUrl: updatedUser.avatarUrl,
                joinedAt: updatedUser.joinedAt,
                streakDays: updatedUser.streakDays
            };

            // Invalidate the cache for this user
            await this.cacheManager.del(`user:${user.userId}`);

            return response;
        } catch (error) {
            throw new BadGatewayException("An error occurred while updating the profile: " + error.message);
        }
    }

    settings(userId: string) {
        return this.prisma.settings.findFirst({
            where: {userId},
            select: {dailyCheckInReminder: true, journalPromptReminder: true, appLock: true, hidePreviews: true}
        });
    }

    async updateSettings(user: { userId: any; }, dto: any) {
        await this.cacheManager.del(`user:${user.userId}`);
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
