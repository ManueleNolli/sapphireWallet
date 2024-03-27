import { Injectable } from '@nestjs/common';

@Injectable()
export class SapphirePortfolioService {
  getHello(): string {
    return 'Hello World!';
  }
}
