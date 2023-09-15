import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { winstonTransports } from 'src/config/logger.config';

@Global() // 전역에서 LoggerService를 사용할 수 있게 해서 중복 코드 제거
@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transports: winstonTransports(config),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
