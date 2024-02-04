import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../users/users.repository';
import { UserBuilder } from '../users/entitiy/user.builder';
import { Gender } from '../users/enum/user.enum';

describe('AuthService', () => {
  let service: AuthService;

  const mockConfigService = {
    get: jest.fn((key) => {
      if (key === 'encrypt.salt') return 10;
    }),
  };

  const mockUsersRepository = {
    findUserByEmail: jest.fn().mockImplementation((email: string) => {
      const user = new UserBuilder()
        .setEmail(email)
        .setPassword('securedPassword')
        .setGender(Gender.Male)
        .setCurrentLocation({
          country: 'South Korea',
          city: 'Seoul',
          district: 'Gangnam',
        })
        .setBiography('Hello World')
        .setAvatar('http://example.com/avatar.jpg')
        .build();
      return user;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
