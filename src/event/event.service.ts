import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from '@prisma/client';
import { AddEventDto } from './dto/add-event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async viewEvent(eventId: number) {
    const event = await this.prisma.event.findFirst({
      where: { id: eventId },
      include: {
        eventTierOnEvent: {
          include: {
            eventTier: true,
            students: true,
          },
        },
      },
    });

    return event;
  }

  async activateEvent(eventId: number) {
    const event = await this.prisma.event.update({
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
    const event = await this.prisma.event.update({
      data: { is_active: false },
      where: { id: eventId },
      select: {
        title: true,
        is_active: true,
      },
    });
    return event;
  }

  // async getActiveEvents(
  //   page = 1,
  //   items = 10,
  // ): Promise<{ activeEvents: Event[]; maxPage: number }> {
  //   const activeEvents = await this.prisma.event.findMany({
  //     where: { is_active: true },
  //     include: { students: true },
  //     take: items,
  //     skip: items * (page - 1),
  //   });

  //   const totalCount = await this.prisma.event.count({
  //     where: { is_active: true },
  //   });

  //   const maxPage = Math.ceil(totalCount / items);

  //   return { activeEvents, maxPage };
  // }

  // async addEvent(addEventDto: AddEventDto) {
  //   const formName = addEventDto.title.toLowerCase().split(' ').join('-');
  //   const event = await this.prisma.event.create({
  //     data: {
  //       title: addEventDto.title,
  //       requires_payment: addEventDto.requires_payment,
  //       price: addEventDto.price,
  //       max_participants: addEventDto.max_participants,
  //       description: addEventDto.description,
  //       date: new Date(),
  //       form_name: formName,
  //     },
  //   });

  //   return event;
  // }

  // async getInactiveEvents(
  //   page = 1,
  //   items = 10,
  // ): Promise<{ inactiveEvents: Event[]; maxPage: number }> {
  //   const inactiveEvents = await this.prisma.event.findMany({
  //     where: { is_active: false },
  //     include: { students: true },
  //     take: items,
  //     skip: items * (page - 1),
  //   });

  //   const totalCount = await this.prisma.event.count({
  //     where: { is_active: false },
  //   });

  //   const maxPage = Math.ceil(totalCount / items);

  //   return { inactiveEvents, maxPage };
  // }

  // async editEvent(id: number, editEventDto: AddEventDto) {
  //   const formName = editEventDto.title.toLowerCase().split(' ').join('-');
  //   const updatedEvent = await this.prisma.event.update({
  //     data: {
  //       title: editEventDto.title,
  //       requires_payment: editEventDto.requires_payment,
  //       price: editEventDto.price,
  //       max_participants: editEventDto.max_participants,
  //       description: editEventDto.description,
  //       date: editEventDto.date,
  //       form_name: formName,
  //     },
  //     where: { id },
  //   });

  //   return updatedEvent;
  // }

  async getAllActiveEvents() {
    const activeEvents = await this.prisma.event.findMany({
      select: { title: true, id: true },
      where: { is_active: true },
    });

    return activeEvents;
  }

  async getEventByFormName(formName: string) {
    const event = await this.prisma.event.findFirst({
      where: { form_name: formName, is_active: true },
    });
    return event;
  }
}
