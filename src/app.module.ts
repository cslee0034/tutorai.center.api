import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { env } from './config/env.config';
import { validationSchema } from './config/env.validator';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { AuthModule } from './auth/auth.module';

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
    LoggerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
