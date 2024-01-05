import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private prismaService: PrismaService) {}

  async viewEvent(eventId: number) {
    return await this.prismaService.event.findFirst({
      where: { id: eventId },
      include: { students: true },
    });
  }

  async activateEvent(eventId: number) {
    const event = this.prismaService.event.update({
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
    const event = this.prismaService.event.update({
      data: { is_active: false },
      where: { id: eventId },
      select: {
        title: true,
        is_active: true,
      },
    });
    return event;
  }
}
