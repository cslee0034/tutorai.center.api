import { RedisModuleOptions } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

export const getRedisConfig = (config: ConfigService): RedisModuleOptions => {
  return {
    type: 'single',
    url: `redis://${config.get('cache.host')}:${config.get('cache.port')}`,
    options: {
      password: config.get('cache.password'),
    },
  };
};
