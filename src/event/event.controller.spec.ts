import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventService } from './event.service';

describe('Events', () => {
  let service: EventService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(EventService);
    prisma = module.get(PrismaService);
  });

  it('returns users', () => {
    expect(service).toBeDefined();
  });
});
