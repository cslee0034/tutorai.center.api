import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.contoller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthSerivce = {
    signup: jest.fn((signUpDto: SignUpDto) => {
      return { accessToken: 'accessToken', refreshToken: 'refreshToken' };
    }),

    signin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthSerivce }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    const mockSignUpDto: SignUpDto = {
      email: 'test@email.com',
      name: 'test_name',
      password: 'test_password',
    };

    it('should be defined', () => {
      expect(controller.signup).toBeDefined();
    });

    it('should be called with SignUpDto', async () => {
      await controller.signup(mockSignUpDto as SignUpDto);

      expect(mockAuthSerivce.signup).toBeCalledWith(mockSignUpDto);
    });

    it('should return token strings object', async () => {
      const tokens = await controller.signup(mockSignUpDto);

      expect(tokens).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      );
    });
  });

  describe('signin', () => {
    const mockSignInDto: SignInDto = {
      email: 'test@email.com',
      password: 'test_password',
    };

    it('should be defined', () => {
      expect(controller.signin).toBeDefined();
    });
  });
});
