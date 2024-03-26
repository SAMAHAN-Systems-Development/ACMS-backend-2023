import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import dayjs from 'dayjs';

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
        let paymentPrice = eventTierOnEvent.earlyBirdPrice;
        if (dayjs().isAfter(dayjs(event.earlyBirdAccessDate))) {
          paymentPrice = eventTierOnEvent.originalPrice;
        }
        return {
          id: eventTierOnEvent.eventTier.id,
          name: eventTierOnEvent.eventTier.name,
          paymentPrice: paymentPrice,
          earlyBirdPrice: eventTierOnEvent.earlyBirdPrice,
          originalPrice: eventTierOnEvent.originalPrice,
          numberOfTicketsLeft:
            eventTierOnEvent.max_participants -
            eventTierOnEvent.students.length,
        };
      },
    );

    return toReturnEventTiers;
  }
}
