import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserBuilder } from './entitiy/user.builder';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const mockUsersService = {
      signup: jest.fn((createUserDto: CreateUserDto) => {
        if (!createUserDto.email) {
          throw new Error('email should not be empty');
        }

        if (!createUserDto.password) {
          throw new Error('password should not be empty');
        }

        const user = new UserBuilder()
          .setEmail(createUserDto.email)
          .setPassword(createUserDto.password)
          .build();

        Promise.resolve({
          ...user,
          id: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should throw error if email is missing', async () => {
      const createUserDto = {
        password: 'test_password',
      };
      await expect(
        controller.signup(createUserDto as CreateUserDto),
      ).rejects.toThrow('email should not be empty');
    });

    it('should throw error if password is missing', async () => {
      const createUserDto = {
        email: 'test@email.com',
      };
      await expect(
        controller.signup(createUserDto as CreateUserDto),
      ).rejects.toThrow('password should not be empty');
    });

    it('should call signUp method with expected DTO', async () => {
      const createUserDto = {
        email: 'test@email.com',
        password: 'test_password',
      };
      await controller.signup(createUserDto as CreateUserDto);
      expect(service.signup).toHaveBeenCalledWith(createUserDto);
    });
  });
});
