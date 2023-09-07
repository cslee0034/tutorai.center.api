import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
import { AllExceptionsFilter } from 'src/common/filters/all-exception.filter';
import { Limiter } from 'src/config/limiter.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
    cors: true,
  });
  const configService = app.get(ConfigService);
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(new Limiter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(app.get('winston')));

  const port = configService.get<number>('app.port');
  await app.listen(port);
}
bootstrap();
