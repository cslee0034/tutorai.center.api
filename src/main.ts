import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // init logger
    logger: new Logger(),
  });
  const configService = app.get(ConfigService);

  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(cors());
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 분 동안
    max: 10000, // 각각의 IP의 요청 10000회로 제한
    standardHeaders: true, // `RateLimit-*` headers로 횟수 제한 정보를 알림
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
  app.use(limiter);

  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get<number>('app.port');
  await app.listen(port);
}
bootstrap();
