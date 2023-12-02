/**
 * @author Manuele Nolli
 * @description Simple service to get environment variables from the process
 */

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EnvironmentService {
  get(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new RpcException(
        new InternalServerErrorException(
          `Environment variable ${key} is missing.`,
        ),
      );
    }
    return value;
  }

  getContractAddress(key: string, network: string): string {
    const keyWithNetwork = `${network.toUpperCase()}_${key}`;
    return this.get(keyWithNetwork);
  }
}
