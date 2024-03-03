import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalConfigModule as ConfigModule } from './library/config/config.module';
import { CacheModule } from './library/cache/cache.redis.module';
import { HttpRequestModule as HttpModule } from './library/http/http.module';
import { LoggerModule } from './library/logger/logger.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { EventModule } from './library/message/event.module';
import { PrismaModule } from './library/orm/prisma.module';
import { JWTModule } from './library/token/jwt.module';
import { JWTPassportModule as PassportModule } from './library/token/passport.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EncryptModule } from './modules/encrypt/encrypt.module';

@Module({
  imports: [
    ConfigModule,
    CacheModule,
    HttpModule,
    LoggerModule,
    EventModule,
    PrismaModule,
    JWTModule,
    PassportModule,
    AuthModule,
    EncryptModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
