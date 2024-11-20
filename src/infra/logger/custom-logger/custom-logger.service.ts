import { Injectable, LoggerService, LogLevel } from '@nestjs/common';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];

  log(message: string, context?: string) {
    if (this.isLogLevelEnabled('log')) {
      this.printMessage('LOG', message, context);
    }
  }

  error(message: string, trace?: string, context?: string) {
    if (this.isLogLevelEnabled('error')) {
      this.printMessage('ERROR', message, context);
      if (trace) {
        console.error(trace);
      }
    }
  }

  warn(message: string, context?: string) {
    if (this.isLogLevelEnabled('warn')) {
      this.printMessage('WARN', message, context);
    }
  }

  debug(message: string, context?: string) {
    if (this.isLogLevelEnabled('debug')) {
      this.printMessage('DEBUG', message, context);
    }
  }

  verbose(message: string, context?: string) {
    if (this.isLogLevelEnabled('verbose')) {
      this.printMessage('VERBOSE', message, context);
    }
  }

  private printMessage(level: string, message: string, context?: string) {
    const timestamp = new Date().toISOString();
    const logContext = context ? `[${context}]` : '';
    console.log(`[${level}] ${timestamp} ${logContext} ${message}`);
  }

  private isLogLevelEnabled(level: LogLevel): boolean {
    return this.logLevels.includes(level);
  }

  setLogLevels(levels: LogLevel[]) {
    this.logLevels = levels;
  }
}
