import * as log4js from 'log4js';

log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '[%d{dd-MM-yyyy - hh:mm:ss.SSS}] [%p] - %m',
      },
    },
    file: {
      type: 'fileSync',
      filename: './logs/app.log',
      layout: {
        type: 'pattern',
        pattern: '[%d{dd-MM-yyyy - hh:mm:ss.SSS}] [%p] - %m',
      },
      maxLogSize: 10485760, // 10MB
      backups: 1,
    },
  },
  categories: {
    default: { appenders: ['console', 'file'], level: 'debug' },
  },
});

export class Logger {
  public static debug(context: string, ...data: any[]) {
    const logger = log4js.getLogger('default');
    logger.level = 'debug';
    logger.debug(context, ...data);
  }

  public static info(context: string, ...data: any[]) {
    const logger = log4js.getLogger('default');
    logger.level = 'info';
    logger.info(context, ...data);
  }

  public static warn(context: string, ...data: any[]) {
    const logger = log4js.getLogger('default');
    logger.level = 'warn';
    logger.warn(context, ...data);
  }

  public static error(context: string, ...data: any[]) {
    const logger = log4js.getLogger('default');
    logger.level = 'error';
    logger.error(context, ...data);
  }

  public static trace(context: string, ...data: any[]) {
    const logger = log4js.getLogger('default');
    logger.level = "trace"
    logger.trace(context, ...data);
  }
}
