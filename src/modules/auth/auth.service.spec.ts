import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../library/cache/cache.redis.service';
import { SignInDto } from './dto/signin.dto';
import { EncryptService } from '../encrypt/encrypt.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockConfigService = {
    get: jest.fn((key: string): number | string => {
      if (typeof key === 'string') {
        return key;
      }

      return key;
    }),
  };

  interface Payload {
    userId: number;
    email: string;
  }
  interface SignOption {
    secret: string;
    expiresIn: string;
  }
  const mockJwtService = {
    signAsync: jest.fn(
      (payload: Payload, signOption: SignOption): Promise<string> => {
        const token = `${payload.userId}_${payload.email}_${signOption.secret}_${signOption.expiresIn}`;
        return Promise.resolve(token);
      },
    ),
  };

  const mockRedisService = {
    set: jest.fn(async (): Promise<void> => {
      return Promise.resolve();
    }),
  };

  const mockUsersService = {
    create: jest.fn(
      ({ email, name, password }: SignUpDto): Promise<UserEntity> => {
        return Promise.resolve(new UserEntity({ email, name, password }));
      },
    ),

    findOneByEmail: jest.fn((email: string) => {
      if (email === 'not_existing@email.com') {
        return null;
      }
      return Promise.resolve(
        new UserEntity({ email, password: 'hashed_test_password' }),
      );
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
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: EncryptService,
          useValue: mockEncryptService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    const mockSignUpDto: SignUpDto = {
      email: 'test@email.com',
      name: 'test_name',
      password: 'test_password',
    };

    it('should called with signAsync function', async () => {
      const userId = 1;
      const email = mockSignUpDto.email;
      const accessSecret = 'jwt.access.secret';
      const accessExpiresIn = 'jwt.access.expiresIn';
      const refreshSecret = 'jwt.refresh.secret';
      const refreshExpiresIn = 'jwt.refresh.expiresIn';

      await service.generateToken(userId, email);

      expect(mockJwtService.signAsync).toBeCalledWith(
        expect.objectContaining({
          sub: userId,
          email: email,
        }),
        expect.objectContaining({
          secret: accessSecret,
          expiresIn: accessExpiresIn,
        }),
      );

      expect(mockJwtService.signAsync).toBeCalledWith(
        expect.objectContaining({
          sub: userId,
          email: mockSignUpDto.email,
        }),
        expect.objectContaining({
          secret: refreshSecret,
          expiresIn: refreshExpiresIn,
        }),
      );
    });

    it('should return token strings object', async () => {
      const userId = 1;
      const email = mockSignUpDto.email;

      const tokens = await service.generateToken(userId, email);

      expect(tokens).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      );
    });

    it('should throw error if it fails to generate token', async () => {
      const userId = 1;
      const email = 'example@email.com';

      mockJwtService.signAsync.mockRejectedValueOnce(
        new Error('Failed to create token'),
      );

      await expect(service.generateToken(userId, email)).rejects.toThrow(
        'Failed to create token',
      );
    });

    it('should throw error if caching is failed', async () => {
      mockRedisService.set.mockRejectedValueOnce(
        new Error('Failed to create token'),
      );

      await expect(service.signup(mockSignUpDto)).rejects.toThrow(
        'Failed to create token',
      );
    });

    describe('singup', () => {
      const mockSignUpDto: SignUpDto = {
        email: 'test@email.com',
        name: 'test_name',
        password: 'test_password',
      };

      it('should be defined', () => {
        expect(service.signup).toBeDefined();
      });

      it('should call create user', async () => {
        await service.signup(mockSignUpDto);

        expect(mockUsersService.create).toBeCalled();
      });

      it('should return token strings object', async () => {
        const tokens = await service.signup(mockSignUpDto);

        expect(tokens).toEqual(
          expect.objectContaining({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
          }),
        );
      });
    });
  });

  describe('signin', () => {
    const mockSignInDto: SignInDto = {
      email: 'test@email.com',
      password: 'test_password',
    };

    it('should be defined', () => {
      expect(service.signin).toBeDefined();
    });

    it('should call findOneByEmail', async () => {
      await service.signin(mockSignInDto);

      expect(mockUsersService.findOneByEmail).toBeCalledWith(
        mockSignInDto.email,
      );
    });

    it('should throw error if there is no existing user', async () => {
      const mockSignInDto: SignInDto = {
        email: 'not_existing@email.com',
        password: 'test_password',
      };

      await expect(service.signin(mockSignInDto)).rejects.toThrow(
        'User not have been created',
      );
    });

    it('should call compare function', async () => {
      await service.signin(mockSignInDto as SignInDto);

      expect(mockEncryptService.compare).toBeCalled();
    });

    it('should throw error if password is not match', async () => {
      const mockSignInDto: SignInDto = {
        email: 'existing@email.com',
        password: 'not_test_password',
      };

      await expect(service.signin(mockSignInDto)).rejects.toThrow(
        `User's password do not match`,
      );
    });

    it('should return token strings object', async () => {
      const tokens = await service.signin(mockSignInDto);

      expect(tokens).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      );
    });
  });
});
