import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GlobalConfigModule as ConfigModule } from './infrastructure/config/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { HttpRequestModule as HttpModule } from './infrastructure/http/http.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RdbTypeOrmModule as TypeOrmModule } from './infrastructure/orm/rdb.typeorm.module';
import { JWTModule } from './infrastructure/token/jwt.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    LoggerModule,
    TypeOrmModule,
    JWTModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
