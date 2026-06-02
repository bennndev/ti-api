import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@/generated/prisma/client';

const PRISMA_ERROR_MAP: Record<string, HttpStatus> = {
  P2002: HttpStatus.CONFLICT,
  P2003: HttpStatus.BAD_REQUEST,
  P2004: HttpStatus.BAD_REQUEST,
  P2014: HttpStatus.BAD_REQUEST,
  P2023: HttpStatus.BAD_REQUEST,
  P2025: HttpStatus.NOT_FOUND,
  P2027: HttpStatus.INTERNAL_SERVER_ERROR,
};

interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let error: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string) || exception.message;
        error = resp.error as string | undefined;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = PRISMA_ERROR_MAP[exception.code] || HttpStatus.INTERNAL_SERVER_ERROR;
      message = this.getPrismaErrorMessage(exception.code, exception.meta);
      error = 'Database Error';
    } else if (exception instanceof Error) {
      message = 'Error interno del servidor';
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${status}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else if (status >= 400) {
      this.logger.warn(`${request.method} ${request.url} → ${status}: ${message}`);
    }

    response.status(status).json(errorResponse);
  }

  private getPrismaErrorMessage(
    code: string,
    _meta?: unknown,
  ): string {
    switch (code) {
      case 'P2002':
        return 'Ya existe un registro con ese valor único.';
      case 'P2003':
        return 'El registro referenciado no existe.';
      case 'P2025':
        return 'El registro solicitado no fue encontrado.';
      default:
        return 'Error en la base de datos.';
    }
  }
}
