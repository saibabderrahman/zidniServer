import * as winston from 'winston';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger = winston.createLogger({
    transports: [
      new winston.transports.File({ filename: 'logs/info.json', level: 'info' }),
      new winston.transports.File({ filename: 'logs/error.json', level: 'error' }),
      new winston.transports.File({ filename: 'logs/warn.json', level: 'warn' }),
      new winston.transports.File({ filename: 'logs/debug.json', level: 'debug' }),
    ],
  });
  saveToFile(data: any) {
    const fileTransport = new winston.transports.File({ filename:"logs/yalidine.json", level: 'info' });
    const time = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const tempLogger = winston.createLogger({ transports: [fileTransport] ,level:"info" });
    const logData = { time ,length:data?.length ,data };
    tempLogger.info(logData);
  }


  log(message: string, context?: any) {
    const fileTransport = new winston.transports.File({ filename:'logs/warn.json', level: 'info' });
    const tempLogger = winston.createLogger({ transports: [fileTransport] ,level:"info" });
    tempLogger.info(`${context ? `[${context}] ` : ''}${message}`);
  }

  error(message: string, trace: string, context?: string) {
    const fileTransport = new winston.transports.File({ filename:'logs/error.json', level: 'error' });
    const tempLogger = winston.createLogger({ transports: [fileTransport] ,level:"error" });
    tempLogger.error(`${context ? `[${context}] ` : ''}${message}`, trace);
  }

  warn(message: string, context?: string) {
    const fileTransport = new winston.transports.File({ filename:'logs/warn.json', level: 'warn' });
    const tempLogger = winston.createLogger({ transports: [fileTransport] ,level:"warn" });
    tempLogger.warn(`${context ? `[${context}] ` : ''}${message}`);
  }

  debug(message: string, context?: string) {
    const fileTransport = new winston.transports.File({ filename:'logs/debug.json', level: 'debug' });
    const tempLogger = winston.createLogger({ transports: [fileTransport] ,level:"debug" });
    tempLogger.error(`${context ? `[${context}] ` : ''}${message}`);

  }
}
