import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HTTPService } from './http.service';

@Global()
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
  providers: [HTTPService],
  exports: [HTTPService],
})
export class HttpRequestModule {}
