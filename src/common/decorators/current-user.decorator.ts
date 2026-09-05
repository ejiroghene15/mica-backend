import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {SafeUser} from "../types";


interface RequestWithUser extends Request {
    user: SafeUser;
}

export const CurrentUser = createParamDecorator(
    (data: keyof SafeUser | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<RequestWithUser>();
        return data ? request.user[data] : request.user;
    },
);
