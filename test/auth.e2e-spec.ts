import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import request from 'supertest';
import {App} from 'supertest/types';
import {AuthModule} from '../src/auth/auth.module';
import {CoreModule} from '../src/core/core.module';
import {PrismaService} from '../src/core/services/prisma.service';
import {ResponseInterceptor} from '../src/common/interceptors/response.interceptor';
import {HttpExceptionFilter} from '../src/common/filters/http-exception.filter';
import {ConfigModule} from '@nestjs/config';
import {MailService} from '../src/mail/mail.service';

describe('Auth (e2e)', () => {
    let app: INestApplication<App>;
    let prisma: PrismaService;

    const testUser = {
        name: 'E2E Test User',
        email: `e2etest-${Date.now()}@example.com`,
        password: 'password123',
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({isGlobal: true}), CoreModule, AuthModule],
        })
            .overrideProvider(MailService)
            .useValue({sendWelcomeEmail: jest.fn().mockResolvedValue(undefined)})
            .compile();

        app = moduleFixture.createNestApplication();
        // Apply the same global pipes and interceptor as main.ts
        app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));
        app.useGlobalInterceptors(new ResponseInterceptor());
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();

        prisma = moduleFixture.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /auth/register', () => {
        it('should successfully register a new user', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send(testUser)
                .expect(201);
            expect(response.body).toEqual({
                success: true,
                data: expect.objectContaining({
                    message: expect.any(String),
                }),
            });
        });

        it('should return 409 when registering with the same email twice', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send(testUser)
                .expect(409);
            expect(response.body).toEqual({
                success: false,
                statusCode: 409,
                message: expect.any(String),
                timestamp: expect.any(String),
            });
        });

        it('should return 400 when registration body is missing required fields', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send({name: 'Incomplete'})
                .expect(400);
            expect(response.body).toEqual({
                success: false,
                statusCode: 400,
                message: expect.arrayContaining([
                    expect.any(String)
                ]),
                timestamp: expect.any(String),
            });
        });

        it('should return 400 when email is invalid', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    name: 'Bad Email',
                    email: 'not-an-email',
                    password: 'password123',
                })
                .expect(400);
            expect(response.body).toEqual({
                success: false,
                statusCode: 400,
                message: expect.arrayContaining([
                    expect.any(String)
                ]),
                timestamp: expect.any(String),
            });
        });

        // Clean up the test user after registration tests
        afterAll(async () => {
            await prisma.user.deleteMany({where: {email: testUser.email}});
        });
    });

    describe('POST /auth/login', () => {
        // Create a user for login tests
        const loginUser = {
            name: 'E2E Login User',
            email: `e2elogin-${Date.now()}@example.com`,
            password: 'loginpassword123',
        };

        beforeAll(async () => {
            // Register the user first so we can test login
            await request(app.getHttpServer()).post('/auth/register').send(loginUser);
        });

        it('should successfully login with valid credentials', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({email: loginUser.email, password: loginUser.password})
                .expect(201)
                .then((response) => {
                    expect(response.body).toEqual({
                        success: true,
                        data: expect.objectContaining({
                            access_token: expect.any(String),
                            refresh_token: expect.any(String),
                        }),
                    });
                });
        });

        it('should return 401 when login password is incorrect', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({email: loginUser.email, password: 'wrongpassword'})
                .expect(401);
            expect(response.body).toEqual({
                success: false,
                statusCode: 401,
                message: expect.any(String),
                timestamp: expect.any(String),
            });
        });

        it('should return 401 when login email does not exist', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({email: 'nonexistent@example.com', password: 'password123'})
                .expect(401);
            expect(response.body).toEqual({
                success: false,
                statusCode: 401,
                message: expect.any(String),
                timestamp: expect.any(String),
            });
        });

        it('should return 400 when login body is missing required fields', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({email: loginUser.email})
                .expect(400);
            expect(response.body).toEqual({
                success: false,
                statusCode: 400,
                message: expect.arrayContaining([
                    expect.any(String)
                ]),
                timestamp: expect.any(String),
            });
        });

        // Clean up the login test user
        afterAll(async () => {
            await prisma.user.deleteMany({where: {email: loginUser.email}});
        });
    });
});
