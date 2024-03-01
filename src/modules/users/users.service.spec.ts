import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    findOneByEmail: jest.fn((email: string): Promise<User | null> => {
      if (email === 'existing@email.com') {
        return Promise.resolve(new UserEntity({ email }));
      } else {
        return Promise.resolve(null);
      }
    }),

    create: jest.fn((): Promise<User | Error> => {
      return;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create user', () => {
    const mockCreateUserDto: CreateUserDto = {
      email: 'test@email.com',
      name: 'test_name',
      password: 'test_password',
    };
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should call findOneByEmail', async () => {
      await service.create(mockCreateUserDto as CreateUserDto);

      expect(mockUserRepository.findOneByEmail).toBeCalledWith(
        mockCreateUserDto.email,
      );
    });

    it('should throw error if user exists', async () => {
      const mockCreateUserDto: CreateUserDto = {
        email: 'existing@email.com',
        name: 'test_name',
        password: 'test_password',
      };

      // service.create()의 반환값인 promise를 테스트 대상으로 하여 내부에서 발생하는 예외를 확인한다
      await expect(service.create(mockCreateUserDto)).rejects.toThrow(
        'User already exists',
      );
    });

    it('should throw error if it fails to create user', async () => {
      mockUserRepository.create.mockRejectedValueOnce(
        new Error('Failed to create user'),
      );

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(
        'Failed to create user',
      );
    });
  });
});
