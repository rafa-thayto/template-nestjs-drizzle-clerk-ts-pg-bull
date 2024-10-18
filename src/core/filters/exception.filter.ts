import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { WithSentry } from '@sentry/nestjs';
import { Response } from 'src/core/dtos/response.dto';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  public constructor() {
    super();
  }
  @WithSentry()
  catch(exception: any, host: ArgumentsHost): any {
    this.logger.error({ exception });
    const hostType = host.getType();
    if (hostType === 'rpc') {
      throw new RpcException(exception?.message);
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const message =
      exception?.response?.data?.error ||
      exception?.response?.message ||
      exception?.response?.error ||
      exception?.response?.data ||
      exception.message;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseData = new Response(null, status, message);

    response.status(status).json(responseData);
  }
}
