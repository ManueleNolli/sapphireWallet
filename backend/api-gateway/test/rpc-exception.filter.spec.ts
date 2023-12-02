import { RpcExceptionFilter } from '../src/rpc-exception.filter';
import { ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

describe('RpcExceptionFilter', () => {
  let filter: RpcExceptionFilter;
  let mockHost: any;

  beforeEach(() => {
    filter = new RpcExceptionFilter();
    mockHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      }),
    };
  });

  it('should handle defined error and format it', () => {
    const exception = new RpcException({
      message: "Network 'aaa' not found",
      error: 'Bad Request',
      statusCode: 400,
    });

    filter.catch(exception, mockHost as unknown as ArgumentsHost);

    expect(mockHost.getResponse().status).toHaveBeenCalledWith(400);
    expect(mockHost.getResponse().json).toHaveBeenCalledWith({
      error: 'Bad Request',
      message: "Network 'aaa' not found",
      statusCode: 400,
    });
  });

  it('should handle undefined error and return the error status and payload', () => {
    const exception = new RpcException(undefined);

    filter.catch(exception, mockHost as unknown as ArgumentsHost);

    expect(mockHost.getResponse().status).toHaveBeenCalledWith(500);
    expect(mockHost.getResponse().json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Internal server error',
    });
  });
});
