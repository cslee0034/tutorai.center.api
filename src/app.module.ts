import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalConfigModule as ConfigModule } from './infrastructure/config/config.module';
import { CacheRedisModule as RedisModule } from './infrastructure/cache/cache.redis.module';
import { HttpRequestModule as HttpModule } from './infrastructure/http/http.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RdbTypeOrmModule as TypeOrmModule } from './infrastructure/orm/rdb.typeorm.module';
import { JWTModule } from './infrastructure/token/jwt.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    HttpModule,
    LoggerModule,
    TypeOrmModule,
    JWTModule,
    AuthModule,
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
