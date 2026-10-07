import {Test, TestingModule} from '@nestjs/testing';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {SignupDto} from './auth.dto';
import {BadGatewayException, ConflictException, InternalServerErrorException} from '@nestjs/common';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        register: jest.fn(),
        login: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(authService).toBeDefined();
    });

    describe('register (signup)', () => {
        const signupDto: SignupDto = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
        };

        it('should call authService.register with the signupDto and return the result', async () => {
            const expectedResponse = {
                message: 'Registration successful. Please check your email to verify your account.',
            };
            mockAuthService.register.mockResolvedValue(expectedResponse);

            const result = await controller.signup(signupDto);

            expect(mockAuthService.register).toHaveBeenCalledTimes(1);
            expect(mockAuthService.register).toHaveBeenCalledWith(signupDto);
            expect(result).toEqual(expectedResponse);
        });

        it('should propagate ConflictException if the user already exists', async () => {
            const error = new ConflictException('User with this email already exists');
            mockAuthService.register.mockRejectedValue(error);

            await expect(controller.signup(signupDto)).rejects.toThrow(ConflictException);
            await expect(controller.signup(signupDto)).rejects.toThrow('User with this email already exists');
            expect(mockAuthService.register).toHaveBeenCalledWith(signupDto);
        });

        it('should propagate BadGatewayException when registration fails', async () => {
            const error = new BadGatewayException('An error occurred while creating the user');
            mockAuthService.register.mockRejectedValue(error);

            await expect(controller.signup(signupDto)).rejects.toThrow(BadGatewayException);
            await expect(controller.signup(signupDto)).rejects.toThrow('An error occurred while creating the user');
            expect(mockAuthService.register).toHaveBeenCalledWith(signupDto);
        });

        it('should propagate any other unexpected errors thrown by authService.register', async () => {
            const error = new InternalServerErrorException('Unexpected error');
            mockAuthService.register.mockRejectedValue(error);

            await expect(controller.signup(signupDto)).rejects.toThrow(InternalServerErrorException);
            expect(mockAuthService.register).toHaveBeenCalledWith(signupDto);
        });
    });

    describe('login', () => {
        const mockUser = {
            id: '1',
            email: 'john@example.com',
            role: 'user',
        };

        const mockReq = {
            user: mockUser,
        };

        it('should call authService.login with req.user and return the tokens', async () => {
            const expectedTokens = {
                access_token: 'access-token-string',
                refresh_token: 'refresh-token-string',
            };
            mockAuthService.login.mockResolvedValue(expectedTokens);

            const result = await controller.login(mockReq);

            expect(mockAuthService.login).toHaveBeenCalledTimes(1);
            expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual(expectedTokens);
        });

        it('should propagate BadGatewayException if login fails', async () => {
            const error = new BadGatewayException('An error occurred while logging in');
            mockAuthService.login.mockRejectedValue(error);

            await expect(controller.login(mockReq)).rejects.toThrow(BadGatewayException);
            await expect(controller.login(mockReq)).rejects.toThrow('An error occurred while logging in');
            expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
        });

        it('should propagate any other unexpected errors thrown by authService.login', async () => {
            const error = new InternalServerErrorException('Unexpected error during login');
            mockAuthService.login.mockRejectedValue(error);

            await expect(controller.login(mockReq)).rejects.toThrow(InternalServerErrorException);
            expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
        });
    });
});
