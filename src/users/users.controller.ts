import {
    Body,
    Controller,
    Get,
    MaxFileSizeValidator,
    ParseFilePipe,
    Patch,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {CurrentUser} from "../common/decorators/current-user.decorator";
import {JwtAuthGuard} from "../auth/jwt.strategy";
import {UserService} from "./user.service";
import {UserProfileDto, UserSettingsDto} from "./dto/user-profile.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {MagicFileTypeValidator} from "./file-type.validator";
import {memoryStorage} from "multer";

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(public userService: UserService) {
    }

    @Get('me')
    profile(@CurrentUser() user): object {
        return this.userService.profile(user.userId);
    }

    @Patch('me')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: memoryStorage(),
        limits: {fileSize: 1024 * 1024},
    }))
    updateProfile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({maxSize: 1024 * 1024}),
                    new MagicFileTypeValidator({
                        allowedMimeTypes: ['image/jpeg', 'image/png'],
                        allowedExtensions: ['.jpg', '.jpeg', '.png'],
                    }),
                ],
                fileIsRequired: false,
            }),
        )
            file: Express.Multer.File | undefined,
        @Body() dto: UserProfileDto,
        @CurrentUser() user
    ) {

        return this.userService.updateProfile(user, dto, file);
    }

    @Get('me/settings')
    getSettings(@CurrentUser() user) {
        return this.userService.settings(user.userId)
    }

    @Patch('me/settings')
    updateSettings(
        @Body() dto: UserSettingsDto,
        @CurrentUser() user
    ) {
        return this.userService.updateSettings(user, dto);
    }
}
