import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get<number>('http.timeout'),
        maxRedirects: configService.get<number>('http.max_redirects'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class HttpRequestModule {}
