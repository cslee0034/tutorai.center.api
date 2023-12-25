import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await compare(password, hash);
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = Number(this.configService.get('encrypt.salt'));
    return await hash(password, salt);
  }

  public async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findUserByEmail(email);

    if (user && (await this.comparePassword(password, user.password))) {
      return user;
    }
    return null;
  }
}
