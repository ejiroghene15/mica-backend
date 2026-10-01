import {Controller, Get} from '@nestjs/common';
import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator,
    PrismaHealthIndicator
} from '@nestjs/terminus';
import {SkipThrottle} from "@nestjs/throttler";
import {PrismaService} from "../core/services/prisma.service";

@SkipThrottle()
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private readonly disk: DiskHealthIndicator,
        private db: PrismaHealthIndicator,
        private prismaService: PrismaService
    ) {
    }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
            () => this.db.pingCheck('database', this.prismaService).withTimeout(5000)
        ]);
    }
}
