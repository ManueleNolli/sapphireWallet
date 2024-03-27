import { Test, TestingModule } from '@nestjs/testing';
import { SapphirePortfolioController } from '../sapphire-portfolio.controller';
import { SapphirePortfolioService } from '../sapphire-portfolio.service';

describe('AppController', () => {
  let appController: SapphirePortfolioController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SapphirePortfolioController],
      providers: [SapphirePortfolioService],
    }).compile();

    appController = app.get<SapphirePortfolioController>(
      SapphirePortfolioController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
