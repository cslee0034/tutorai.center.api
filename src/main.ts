import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
import { Limiter } from 'src/config/limiter.config';
import { AllExceptionsFilter } from 'src/common/filters/all-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const logger = app.get('winston');
  const configService = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(new Limiter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(logger, httpAdapterHost));

  const port = configService.get<number>('app.port');

  app.setGlobalPrefix('api/v1');
  await app.listen(port);

  logger.info(`center.api is listening on port ${port}`);
}
bootstrap();
