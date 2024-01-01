import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private prismaService: PrismaService) {}

  async activateEvent(eventId: number) {
    const event = this.prismaService.event.update({
      data: { is_active: true },
      where: { id: eventId }, // TODO: Use DTO to implicit type cast
      select: {
        title: true,
        is_active: true,
      },
    });
    return event;
  }

  async inactivateEvent(eventId: number) {
    const event = this.prismaService.event.update({
      data: { is_active: false },
      where: { id: eventId }, // TODO: Use DTO to implicit type cast
      select: {
        title: true,
        is_active: true,
      },
    });
    return event;
  }
}