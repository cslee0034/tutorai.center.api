import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrpyt from 'bcrypt';

@Injectable()
export class EncryptService {
  constructor(private readonly configService: ConfigService) {}

  async hash(key: string): Promise<string> {
    const salt = this.configService.get<string>('encrypt.salt');
    return await bcrpyt.hash(key, Number(salt));
  }

  async compare(key: string, hashedKey: string): Promise<boolean> {
    return await bcrpyt.compare(key, hashedKey);
  }
}
