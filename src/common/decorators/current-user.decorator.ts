import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {User} from "../../../generated/prisma/client";

export type SafeUser = Omit<User, 'password' | 'resetPasswordToken'>;

interface RequestWithUser extends Request {
    user: SafeUser;
}

export const CurrentUser = createParamDecorator(
    (data: keyof SafeUser | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<RequestWithUser>();
        return data ? request.user[data] : request.user;
    },
);
