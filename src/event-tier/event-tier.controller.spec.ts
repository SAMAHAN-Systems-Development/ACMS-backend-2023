import { Test, TestingModule } from '@nestjs/testing';
import { EventTierController } from './event-tier.controller';
import { EventTierService } from './event-tier.service';

describe('EventTierController', () => {
  let controller: EventTierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventTierController],
      providers: [EventTierService],
    }).compile();

    controller = module.get<EventTierController>(EventTierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
