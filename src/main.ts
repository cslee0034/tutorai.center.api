import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';
import { httpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SuccessInterceptor } from './common/interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const logger = app.get('winston');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');
  const reflector = app.get(Reflector);

  const swaggerOptions = new DocumentBuilder()
    .setTitle(`${configService.get<string>('app.serverName')}`)
    .setDescription(
      `${configService.get<string>('app.serverName')} API description`,
    )
    .setVersion('0.0.1')
    .setContact(
      'cslee0034',
      'https://hardworking-everyday.tistory.com/',
      'cslee0034@gmail.com',
    )
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
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(logger),
    new httpExceptionFilter(logger),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  await app.listen(port);

  logger.info(
    `${configService.get<string>(
      'app.serverName',
    )}.api is listening on port ${port}`,
  );
}
bootstrap();
