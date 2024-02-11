import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from '@prisma/client';
import { AddEventDto } from './dto/add-event.dto';

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

  async getActiveEvents(
    page = 1,
    items = 10,
  ): Promise<{ activeEvents: Event[]; maxPage: number }> {
    const activeEvents = await this.prismaService.event.findMany({
      where: { is_active: true },
      take: items,
      skip: items * (page - 1),
    });

    const totalCount = await this.prismaService.event.count({
      where: { is_active: true },
    });

    const maxPage = Math.ceil(totalCount / items);

    return { activeEvents, maxPage };
  }

  async addEvent(AddEventDto: AddEventDto) {
    console.log(AddEventDto.title);
    const event = await this.prismaService.event.create({
      data: {
        title: AddEventDto.title,
        requires_payment: AddEventDto.requires_payment,
        price: AddEventDto.price,
        max_participants: AddEventDto.max_participants,
        description: AddEventDto.description,
        date: new Date(),
        form_name: 'Event',
      },
    });

    return event;
  }

  async getInactiveEvents(
    page = 1,
    items = 10,
  ): Promise<{ inactiveEvents: Event[]; maxPage: number }> {
    const inactiveEvents = await this.prismaService.event.findMany({
      where: { is_active: false },
      take: items,
      skip: items * (page - 1),
    });

    const totalCount = await this.prismaService.event.count({
      where: { is_active: false },
    });

    const maxPage = Math.ceil(totalCount / items);

    return { inactiveEvents, maxPage };
  }

  async editEvent(id: number, editEventDto: AddEventDto) {
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
