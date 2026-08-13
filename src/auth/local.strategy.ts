import {Strategy} from 'passport-local';
import {AuthGuard, PassportStrategy} from '@nestjs/passport';
import {ExecutionContext, Injectable, UnauthorizedException, ValidationPipe} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginDto} from "./auth.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({usernameField: 'email'});
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException("Invalid email or password");
        }
        return user;
    }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // Manually run the same validation your ValidationPipe would normally do
        const dto = Object.assign(new LoginDto(), request.body);
        await new ValidationPipe({whitelist: true, forbidNonWhitelisted: true})
            .transform(dto, {type: 'body', metatype: LoginDto});

        // Only reaches Passport if the DTO validation above didn't throw
        return super.canActivate(context) as Promise<boolean>;
    }
}