import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {User} from "../../../generated/prisma/client";

export type SafeUser = Omit<User, 'password'>;

interface RequestWithUser extends Request {
    user: AuthenticatedUser;
}

export const CurrentUser = createParamDecorator<keyof AuthenticatedUser | undefined>(
    (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<RequestWithUser>();
        return data ? request.user[data] : request.user;
    },
);
