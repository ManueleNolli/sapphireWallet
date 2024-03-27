import { Module } from '@nestjs/common';
import { SapphirePortfolioController } from './sapphire-portfolio.controller';
import { SapphirePortfolioService } from './sapphire-portfolio.service';

@Module({
  imports: [],
  controllers: [SapphirePortfolioController],
  providers: [SapphirePortfolioService],
})
export class SapphirePortfolioModule {}
