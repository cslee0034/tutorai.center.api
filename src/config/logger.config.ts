import { ConfigService } from '@nestjs/config';
import { utilities } from 'nest-winston';
import * as winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: `./logs/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30,
    zippedArchive: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      utilities.format.nestLike('center.api', {
        colors: false,
        prettyPrint: true,
      }),
    ),
  };
};

export const winstonTransports = (config: ConfigService) => [
  new winston.transports.Console({
    level: config.get<string>('app.node') === 'production' ? 'warn' : 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      utilities.format.nestLike('center.api', {
        prettyPrint: true,
      }),
    ),
  }),
  new winstonDaily(dailyOptions('warn')),
  new winstonDaily(dailyOptions('error')),
];
