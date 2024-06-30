/**
 * @author Manuele Nolli
 * @description Simple service to get environment variables from the process
 */

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EnvironmentService {
  /**
   * @description Get an environment variable from the process and throw an exception if it is not defined
   * @param key
   */
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

  /**
   * @description Get an environment variable from the process and throw an exception if it is not defined. The key is concatenated with the network
   * @param key
   * @param network
   */
  getWithNetwork(key: string, network: string): string {
    const keyWithNetwork = `${network.toUpperCase()}_${key}`;
    return this.get(keyWithNetwork);
  }

  /**
   * @description Get an environment variable from the process and return null if it is not defined
   * @param key
   * @param network (optional)
   */
  getUnhandled(key: string, network?: string): string {
    let finalKey = key;
    if (network) {
      finalKey = `${network.toUpperCase()}_${key}`;
    }
    return process.env[finalKey];
  }
}
