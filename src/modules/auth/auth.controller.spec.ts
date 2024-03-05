import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/request/signup.dto';
import { EncryptService } from '../encrypt/encrypt.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/request/login.dto';
import { UserEntity } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthSerivce = {
    signup: jest.fn((signUpDto: SignUpDto) => {
      return { accessToken: 'accessToken', refreshToken: 'refreshToken' };
    }),

    signin: jest.fn(),

    login: jest.fn(() => {
      return true;
    }),

    logout: jest.fn(),

    generateToken: jest.fn((userId: number, email: string) => {
      return {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
    }),
  };

  const mockUsersService = {
    create: jest.fn(() => {
      return {
        id: 1,
        email: 'example@email.com',
      };
    }),

    findOneByEmail: jest.fn((email: string) => {
      if (email === 'test@email.com') {
        return new UserEntity({
          id: 2,
          email: 'test@email.com',
          name: 'test_name',
        });
      }
    }),
  };

  const mockEncryptService = {
    compare: jest.fn((key: string, hashedKey: string) => {
      if (hashedKey === 'hashed_' + key) {
        return true;
      }
      return false;
    }),

    compareAndThrow: jest.fn(),
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

    it('should call generateToken with created user information', async () => {
      await controller.signup(mockSignUpDto);

      expect(mockAuthSerivce.generateToken).toBeCalledWith(
        1,
        'example@email.com',
      );
    });

    it("should call login with user's id and refreshToken", async () => {
      await controller.signup(mockSignUpDto);

      expect(mockAuthSerivce.login).toBeCalledWith(1, 'refreshToken');
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@email.com',
      password: 'test_password',
    };
    it('should be defined', () => {
      expect(controller.login).toBeDefined();
    });

    it('should call userService.findOneByEmail with LoginUpDto', async () => {
      await controller.login(loginDto);

      expect(mockUsersService.findOneByEmail).toBeCalledWith(loginDto.email);
    });

    it("should call generateToken with found user's information", async () => {
      await controller.login(loginDto);

      expect(mockAuthSerivce.generateToken).toBeCalledWith(2, 'test@email.com');
    });

    it("should call generateToken with found user's information", async () => {
      await controller.login(loginDto);

      expect(mockAuthSerivce.generateToken).toBeCalledWith(2, 'test@email.com');
    });

    it("should call login with user's id and refreshToken", async () => {
      await controller.login(loginDto);

      expect(mockAuthSerivce.login).toBeCalledWith(2, 'refreshToken');
    });
  });
});
