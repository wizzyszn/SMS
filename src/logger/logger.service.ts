import { Injectable, LoggerService } from '@nestjs/common';
const isDev = process.env.NODE_ENV !== 'production';
@Injectable()
export class StandardLoggerService implements LoggerService {
  log(message: string, context?: string) {
    console.log(`[LOG] ${this.formatContext(context)} ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    console.error(`[ERROR] ${this.formatContext(context)} ${message}`);
    if (trace) console.error(trace);
  }

  warn(message: string, context?: string) {
    console.warn(`[WARN] ${this.formatContext(context)} ${message}`);
  }

  debug(message: string, context?: string) {
    if (isDev) {
      console.debug(`[DEBUG] ${this.formatContext(context)} ${message}`);
    }
  }

  verbose(message: string, context?: string) {
    console.info(`[VERBOSE] ${this.formatContext(context)} ${message}`);
  }

  private formatContext(context?: string) {
    return context ? `[${context}]` : '';
  }
}
