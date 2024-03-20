import { Test, TestingModule } from '@nestjs/testing';
import { EventTierService } from './event-tier.service';

describe('EventTierService', () => {
  let service: EventTierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventTierService],
    }).compile();

    service = module.get<EventTierService>(EventTierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
