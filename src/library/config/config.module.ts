import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { env } from '../../config/env';
import { validationSchema } from 'src/config/env.validator';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true, // 설정에 대해서 캐싱
      isGlobal: true, // 전역 모듈화
      load: [env], // env에서 설정 값을 가져온다
      validationSchema, // 유효성 검증 스키마
      validationOptions: {
        abortEarly: true, // 유효성 검사 과정 중 처음 오류 발생 즉시 중지
      },
    }),
  ],
})
export class GlobalConfigModule {}
