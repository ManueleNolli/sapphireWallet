import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    console.log('RpcExceptionFilter', exception);
    const error: any = exception.getError();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (error === undefined) {
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    } else {
      response.status(error.statusCode).json(error);
    }
  }
}
