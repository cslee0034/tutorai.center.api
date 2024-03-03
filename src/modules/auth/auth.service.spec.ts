import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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

  const mockUsersService = {
    create: jest.fn(({ email, name, password }: SignUpDto) => {
      return new UserEntity({ email, name, password });
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
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should called with signAsync function', async () => {
      const userId = 1;
      const email = 'example@email.com';
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
          email: email,
        }),
        expect.objectContaining({
          secret: refreshSecret,
          expiresIn: refreshExpiresIn,
        }),
      );
    });

    it('should return token strings object', async () => {
      const userId = 1;
      const email = 'example@email.com';

      const tokens = await service.generateToken(userId, email);

      expect(tokens).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      );
    });
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
