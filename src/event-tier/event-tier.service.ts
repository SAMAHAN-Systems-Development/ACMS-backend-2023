import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';

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
        const now = dayjs(`${new Date().toJSON().split('T')[0]}T00:00:00.000Z`);
        const earlyBirdAccessDate = dayjs(
          `${event.earlyBirdAccessDate.toJSON().split('T')[0]}T00:00:00.000Z`,
        );

        let paymentPrice = eventTierOnEvent.originalPrice;
        if (event.hasEarlyBirdAccess) {
          if (
            now.isBefore(earlyBirdAccessDate) ||
            now.isSame(earlyBirdAccessDate)
          ) {
            paymentPrice = eventTierOnEvent.earlyBirdPrice;
          }
        }

        return {
          id: eventTierOnEvent.eventTier.id,
          name: eventTierOnEvent.eventTier.name,
          price: paymentPrice,
          numberOfTicketsLeft:
            eventTierOnEvent.max_participants -
            eventTierOnEvent.students.length,
        };
      },
    );

    return toReturnEventTiers;
  }
}
