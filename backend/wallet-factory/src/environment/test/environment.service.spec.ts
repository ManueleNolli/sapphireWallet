import { EnvironmentService } from '../environment.service';
import { RpcException } from '@nestjs/microservices';
import { InternalServerErrorException } from '@nestjs/common';

describe('EnvironmentService', () => {
  let environmentService: EnvironmentService;

  beforeEach(() => {
    environmentService = new EnvironmentService();
  });

  it('get: should get environment variable', () => {
    const key = 'TEST_KEY';
    const value = 'test_value';
    process.env[key] = value;

    const result = environmentService.get(key);

    expect(result).toEqual(value);
  });

  it('get: should throw RpcException when environment variable is missing', () => {
    const key = 'MISSING_KEY';

    expect(() => environmentService.get(key)).toThrow(
      new RpcException(
        new InternalServerErrorException(
          `Environment variable ${key} is missing.`,
        ),
      ),
    );
  });

  it('getWithNetwork: should get address based on key and network', () => {
    const key = 'CONTRACT_KEY';
    const network = 'test';
    const keyWithNetwork = `${network.toUpperCase()}_${key}`;
    const value = 'contract_address';

    process.env[keyWithNetwork] = value;

    const result = environmentService.getWithNetwork(key, network);

    expect(result).toEqual(value);
  });

  it('getUnhandled: should get environment variable without throwing an exception', () => {
    const result = environmentService.getUnhandled('MISSING_KEY', 'test');
    expect(result).toEqual(undefined);
  });
});
