import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {jwtConstants} from './constants';
import { Request } from 'express';


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
            secretOrKey: jwtConstants.secret,
            passReqToCallback: true, // gives you access to req in validate()
            ignoreExpiration: false,
        });
    }

    validate(req: Request, payload: { sub: string; email: string }) {
        const refreshToken = req.body?.refresh_token;
        return {...payload, refreshToken};
    }
}
