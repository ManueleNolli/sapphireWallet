import { Controller, Get } from '@nestjs/common';
import { SapphirePortfolioService } from './sapphire-portfolio.service';

@Controller()
export class SapphirePortfolioController {
  constructor(private readonly appService: SapphirePortfolioService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
