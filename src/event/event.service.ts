import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(private prismaService: PrismaService) {}

  async activateEvent(eventId: number) {
    const event = await this.prismaService.event.update({
      data: { is_active: true },
      where: { id: eventId },
      select: {
        title: true,
        is_active: true,
      },
    });
    return event;
  }

  async inactivateEvent(eventId: number) {
    const event = await this.prismaService.event.update({
      data: { is_active: false },
      where: { id: eventId },
      select: {
        title: true,
        is_active: true,
      },
    });
    return event;
  }

  async getActiveEvents(page = 1, items = 10): Promise<Event[]> {
    return this.prismaService.event.findMany({
      where: { is_active: true },
      take: items,
      skip: items * (page - 1),
    });
  }
}
