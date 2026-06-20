import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const started = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(
            JSON.stringify({
              method: req.method,
              path: req.url,
              status: res.statusCode,
              durationMs: Date.now() - started,
            }),
          );
        },
        error: (err: Error) => {
          this.logger.error(
            JSON.stringify({
              method: req.method,
              path: req.url,
              status: res.statusCode,
              durationMs: Date.now() - started,
              error: err.message,
            }),
          );
        },
      }),
    );
  }
}
