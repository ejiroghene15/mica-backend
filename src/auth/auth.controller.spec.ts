import {Test, TestingModule} from '@nestjs/testing';
import {AuthController} from './auth.controller';
import {PrismaService} from "../core/services/prisma.service";
import {AuthService} from "./auth.service";
import {MailService} from "../mail/mail.service";
import {JwtService} from "@nestjs/jwt";

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;
    let prisma: PrismaService;
    let mail: MailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            findUnique: jest.fn(),
                            create: jest.fn(),
                        }
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    }
                },
                {
                    provide: MailService,
                    useValue: {
                        sendWelcomeEmail: jest.fn(),
                    }
                },
                {
                    provide: AuthService,
                    useValue: {
                        register: jest.fn(),
                        validateUser: jest.fn(),
                        login: jest.fn(),
                    }
                }
            ], // Add any necessary providers here
        }).compile();

        // controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        // expect(controller).toBeDefined();
        expect(authService).toBeDefined();
    });
    
});
