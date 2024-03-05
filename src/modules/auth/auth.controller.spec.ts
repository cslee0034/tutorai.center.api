import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { EncryptService } from '../encrypt/encrypt.service';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthSerivce = {
    signup: jest.fn((signUpDto: SignUpDto) => {
      return { accessToken: 'accessToken', refreshToken: 'refreshToken' };
    }),

    signin: jest.fn(),

    logout: jest.fn(),
  };

  const mockUsersService = {
    create: jest.fn(() => {
      return {
        id: 1,
        email: 'example@email.com',
      };
    }),
  };

  const mockEncryptService = {
    compare: jest.fn((key: string, hashedKey: string) => {
      if (hashedKey === 'hashed_' + key) {
        return true;
      }
      return false;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthSerivce },
        { provide: UsersService, useValue: mockUsersService },
        { provide: EncryptService, useValue: mockEncryptService },
      ],
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

    it('should call userService.create with SignUpDto', async () => {
      await controller.signup(mockSignUpDto);

      expect(mockUsersService.create).toBeCalledWith(mockSignUpDto);
    });
  });
});
