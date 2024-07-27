import { Test, TestingModule } from '@nestjs/testing';
import { MessenagerBotController } from './messenager-bot.controller';

describe('MessenagerBotController', () => {
  let controller: MessenagerBotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessenagerBotController],
    }).compile();

    controller = module.get<MessenagerBotController>(MessenagerBotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
