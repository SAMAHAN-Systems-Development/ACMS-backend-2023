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

  async getEventTiersBasedOnEventId(eventId: number) {
    const event = await this.prisma.event.findFirst({
      where: { id: eventId },
      include: {
        eventTierOnEvent: {
          include: {
            students: true,
            eventTier: true,
          },
        },
      },
    });

    const toReturnEventTiers = event.eventTierOnEvent.map(
      (eventTierOnEvent) => {
        return {
          id: eventTierOnEvent.eventTier.id,
          name: eventTierOnEvent.eventTier.name,
          adduPrice: eventTierOnEvent.adduPrice,
          nonAdduPrice: eventTierOnEvent.nonAdduPrice,
          numberOfTicketsLeft:
            eventTierOnEvent.max_participants -
            eventTierOnEvent.students.length,
        };
      },
    );

    return toReturnEventTiers;
  }
}
