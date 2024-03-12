import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/request/signup.dto';
import { EncryptService } from '../encrypt/encrypt.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/request/login.dto';
import { UserEntity } from '../users/entities/user.entity';
import { Tokens } from './types/tokens.type';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;
  let usersService: any;
  let encryptService: any;

  const mockSignUpDto: SignUpDto = {
    email: 'test@email.com',
    name: 'test_name',
    password: 'test_password',
  };

  const mockLoginDto: LoginDto = {
    email: 'test@email.com',
    password: 'test_password',
  };

  const mockCreateUserResult: UserEntity = new UserEntity({
    id: 1,
    email: 'test@email.com',
    name: 'test_name',
    password: 'hashed_test_password',
  });

  const mockFindOneByEmailResult: UserEntity = new UserEntity({
    id: 1,
    email: 'test@email.com',
    name: 'test_name',
    password: 'hashed_test_password',
  });

  const mockTokenResult: Tokens = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
  };

  const mockAuthService = {
    login: jest
      .fn()
      .mockImplementation(
        (id: string, refreshToken: string): Promise<boolean> => {
          if (id && refreshToken) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(
              new InternalServerErrorException('Failed to set refresh token'),
            );
          }
        },
      ),

    logout: jest.fn().mockImplementation((id: string): Promise<boolean> => {
      if (id) {
        return Promise.resolve(true);
      } else {
        return Promise.reject(
          new InternalServerErrorException('Failed to delete refresh token'),
        );
      }
    }),

    generateToken: jest
      .fn()
      .mockImplementation((userId: number, email: string): Promise<Tokens> => {
        if (userId && email) {
          return Promise.resolve(mockTokenResult);
        } else {
          return Promise.reject(
            new InternalServerErrorException('Failed to create token'),
          );
        }
      }),
  };

  const mockUsersService = {
    create: jest
      .fn()
      .mockImplementation((mockSignUpDto: SignUpDto): Promise<UserEntity> => {
        if (
          mockSignUpDto.email === 'test@email.com' &&
          mockSignUpDto.password === 'test_password' &&
          mockSignUpDto.name === 'test_name'
        ) {
          return Promise.resolve(mockCreateUserResult);
        } else {
          return Promise.reject(new ForbiddenException('User already exists'));
        }
      }),

    findOneByEmail: jest.fn((email: string): Promise<UserEntity> => {
      if (email === 'test@email.com') {
        return Promise.resolve(mockFindOneByEmailResult);
      } else {
        return Promise.reject(new NotFoundException('User not found'));
      }
    }),
  };

  const mockEncryptService = {
    compare: jest.fn((key: string, hashedKey: string): Promise<boolean> => {
      if (hashedKey === 'hashed_' + key) {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }),

    compareAndThrow: jest
      .fn()
      .mockImplementation((key: string, hashedKey: string): Promise<void> => {
        if (mockEncryptService.compare(key, hashedKey)) {
          return Promise.resolve();
        } else {
          Promise.reject(new UnauthorizedException('Key does not match'));
        }
      }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: EncryptService, useValue: mockEncryptService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    encryptService = module.get<EncryptService>(EncryptService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should be defined', () => {
      expect(controller.signup).toBeDefined();
    });

    it('should call userService.create with SignUpDto', async () => {
      await controller.signup(mockSignUpDto as SignUpDto);

      expect(usersService.create).toBeCalledWith(mockSignUpDto as SignUpDto);
    });

    it('should call generateToken with created user information', async () => {
      await controller.signup(mockSignUpDto as SignUpDto);

      expect(authService.generateToken).toBeCalledWith(
        mockCreateUserResult.id as number,
        mockCreateUserResult.email as string,
      );
    });

    it("should call login with user's id and refreshToken", async () => {
      await controller.signup(mockSignUpDto as SignUpDto);

      expect(authService.login).toBeCalledWith(
        mockCreateUserResult.id as number,
        mockTokenResult.refreshToken as string,
      );
    });

    it('should return tokens', async () => {
      const result = await controller.signup(mockSignUpDto as SignUpDto);

      expect(result).toEqual(mockTokenResult);
    });
  });

  describe('login', () => {
    it('should be defined', () => {
      expect(controller.login).toBeDefined();
    });

    it('should call userService.findOneByEmail with LoginUpDto', async () => {
      await controller.login(mockLoginDto as LoginDto);

      expect(usersService.findOneByEmail).toBeCalledWith(
        mockLoginDto.email as string,
      );
    });

    it('should call encryptService.compareAndThrow with password', async () => {
      await controller.login(mockLoginDto as LoginDto);

      expect(encryptService.compareAndThrow).toBeCalledWith(
        mockLoginDto.password as string,
        mockFindOneByEmailResult.password as string,
      );
    });

    it("should call generateToken with found user's information", async () => {
      await controller.login(mockLoginDto as LoginDto);

      expect(authService.generateToken).toBeCalledWith(
        mockFindOneByEmailResult.id as number,
        mockFindOneByEmailResult.email as string,
      );
    });

    it("should call login with user's id and refreshToken", async () => {
      await controller.login(mockLoginDto as LoginDto);

      expect(authService.login).toBeCalledWith(
        mockFindOneByEmailResult.id as number,
        mockTokenResult.refreshToken as string,
      );
    });

    it('should return tokens', async () => {
      const result = await controller.login(mockLoginDto as LoginDto);

      expect(result).toEqual(mockTokenResult);
    });
  });

  describe('logout', () => {
    it('should be defined', () => {
      expect(controller.logout).toBeDefined();
    });

    it('should call authService.logout with id and refreshToken', async () => {
      const id = mockCreateUserResult.id as number;

      await controller.logout(id);

      expect(authService.logout).toBeCalledWith(id);
    });

    it('should return success', async () => {
      const id = mockCreateUserResult.id as number;

      const result = await controller.logout(id);

      expect(result).toEqual({ success: true });
    });
  });
});
