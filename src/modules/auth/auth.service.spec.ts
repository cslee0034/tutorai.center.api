import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { SignUpDto } from './dto/signup.dto';

describe('AuthService', () => {
  let service: AuthService;

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
  });
});
