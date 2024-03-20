import { Injectable } from '@nestjs/common';
import { CreateEventTierDto } from './dto/create-event-tier.dto';
import { UpdateEventTierDto } from './dto/update-event-tier.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventTierService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.eventTier.findMany();
  }

  getEventTiersBasedOnEventId(eventId: number) {
    return this.prisma.eventTier.findMany({
      where: {
        eventTierOnEvent: {
          every: {
            eventId: eventId,
          },
        },
      },
    });
  }
}
