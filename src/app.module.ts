import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalConfigModule as ConfigModule } from './library/config/config.module';
import { CacheRedisModule as RedisModule } from './library/cache/cache.redis.module';
import { HttpRequestModule as HttpModule } from './library/http/http.module';
import { LoggerModule } from './library/logger/logger.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PrismaModule } from './library/orm/prisma.module';
import { JWTModule } from './library/token/jwt.module';
import { JWTPassportModule as PassportModule } from './library/token/passport.module';
import { UesrsModule } from './modules/uesrs/uesrs.module';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    HttpModule,
    LoggerModule,
    PrismaModule,
    JWTModule,
    PassportModule,
    UesrsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
