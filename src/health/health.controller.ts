import {Controller, Get} from '@nestjs/common';
import {HealthCheck, HealthCheckService, HttpHealthIndicator, PrismaHealthIndicator} from '@nestjs/terminus';
import {SkipThrottle} from "@nestjs/throttler";
import {PrismaService} from "../core/services/prisma.service";
import {MailerHealthIndicator} from "@nestjs-modules/mailer";

@SkipThrottle()
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private db: PrismaHealthIndicator,
        private prismaService: PrismaService,
        private mailerHealth: MailerHealthIndicator,
    ) {
    }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.http.pingCheck('google', 'https://google.com'),
            () => this.db.pingCheck('database', this.prismaService).withTimeout(5000),
            () => this.mailerHealth.isHealthy('mailer'),
        ]);
    }
}
