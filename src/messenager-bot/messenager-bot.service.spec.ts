import { Test, TestingModule } from '@nestjs/testing';
import { MessenagerBotService } from './messenager-bot.service';

describe('MessenagerBotService', () => {
  let service: MessenagerBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessenagerBotService],
    }).compile();

    service = module.get<MessenagerBotService>(MessenagerBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
