import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: config.get('rdb.host'),
    port: config.get('rdb.port'),
    username: config.get('rdb.username'),
    password: config.get('rdb.password'),
    database: config.get('rdb.name'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: config.get('rdb.synchronize') === 'true',
    logging: config.get('rdb.logging') === 'true',
  };
};
