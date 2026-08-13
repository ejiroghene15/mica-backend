import {ExtractJwt, Strategy} from 'passport-jwt';
import {AuthGuard, PassportStrategy} from '@nestjs/passport';
import {ExecutionContext, Injectable} from '@nestjs/common';
import {jwtConstants} from './constants';
import {Request} from 'express';


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
            secretOrKey: jwtConstants.refresh_secret,
            passReqToCallback: true, // gives you access to req in validate()
            ignoreExpiration: false,
        });
    }

    validate(req: Request, payload: { sub: string; email: string }) {
        const refreshToken = req.body?.refreshToken;
        return {userId: payload.sub, refreshToken};
    }
}

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        return super.canActivate(context) as Promise<boolean>;
    }
}
