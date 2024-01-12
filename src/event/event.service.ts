import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from '@prisma/client';
import { AddEventDto } from './dto/add-events.dto';

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

  async editEvents(id: number, editEventDto: AddEventDto) {
    const updatedEvent = await this.prismaService.event.update({
      data: {
        title: editEventDto.title,
        requires_payment: editEventDto.requires_payment,
        price: editEventDto.price,
        max_participants: editEventDto.max_participants,
        description: editEventDto.description,
        date: new Date(),
        form_name: 'Event',
      },
      where: { id },
    });

    return updatedEvent;
  }
}
