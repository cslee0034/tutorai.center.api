import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
import { Limiter } from './config/limiter';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const logger = app.get('winston');
  const configService = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);
  const port = configService.get<number>('app.port');

  const swaggerOptions = new DocumentBuilder()
    .setTitle(`${configService.get<string>('app.serverName')}`)
    .setDescription('nomadia API description')
    .setVersion('1.0.0')
    .setContact(
      'cslee0034',
      'https://hardworking-everyday.tistory.com/',
      'cslee0034@gmail.com',
    )
    .addServer('/v1')
    .addTag(`${configService.get<string>('app.serverName')}.api`)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  // 포트폴리오 용으로 개발하고 있기 때문에 모든 환경에서 api 정의서 오픈
  if (true) {
    SwaggerModule.setup('api', app, document);
  }

  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(new Limiter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(logger, httpAdapterHost));

  await app.listen(port);

  logger.info(
    `${configService.get<string>(
      'app.serverName',
    )}.api is listening on port ${port}`,
  );
}
bootstrap();
