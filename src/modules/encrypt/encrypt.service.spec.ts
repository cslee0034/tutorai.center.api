import { Test, TestingModule } from '@nestjs/testing';
import { EncryptService } from './encrypt.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

describe('EncryptService', () => {
  let service: EncryptService;

  const mockConfigService = {
    get: jest.fn((key: string): number | string => {
      if (key === 'encrypt.salt') {
        return 'salt';
      }

      return key;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptService,
        {
          provide: ConfigService,
          // class가 아니라 value만을 이용할 때는 useValue로 provide
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EncryptService>(EncryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    const key = 'un_encrypted key';

    it('should be defined', () => {
      expect(service.hash).toBeDefined();
    });

    it('should get salt from configService', async () => {
      await service.hash(key);

      expect(mockConfigService.get).toHaveBeenCalledWith('encrypt.salt');
    });

    it('should return hashed key', async () => {
      const hashedKey = await service.hash(key);
      const isMatch = await bcrypt.compare(key, hashedKey);

      expect(isMatch).toBe(true);
    });
  });
});
