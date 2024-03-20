import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event, Student } from '@prisma/client';
import { AddEventDto } from './dto/add-event.dto';
import { EditEventsDto } from './dto/edit-event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async viewEvent(eventId: number) {
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

    const students = await this.prisma.student.findMany({
      include: {
        eventTierOnEvent: {
          include: {
            eventTier: true,
          },
        },
      },
      where: {
        eventTierOnEvent: {
          is: {
            eventId: eventId,
          },
        },
      },
    });

    const eventToReturn = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      is_active: event.is_active,
      form_name: event.form_name,
      requires_payment: event.requires_payment,
      students: students.map((student) => {
        return {
          id: student.id,
          uuid: student.uuid,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          year_and_course: student.year_and_course,
          requires_payment: student.requires_payment,
          eventTier: student.eventTierOnEvent.eventTier.name,
        };
      }),
      eventTiers: event.eventTierOnEvent.map((eventTierOnEvent) => {
        return {
          ...eventTierOnEvent.eventTier,
          numberOfPeopleRegistered: eventTierOnEvent.students.length,
          crowdLimit: eventTierOnEvent.max_participants,
          numberOfTicketsLeft:
            eventTierOnEvent.max_participants -
            eventTierOnEvent.students.length,
          price: eventTierOnEvent.price,
        };
      }),
    };
    return eventToReturn;
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

  async getActiveEvents(page = 1, items = 10) {
    const activeEvents = await this.prisma.event.findMany({
      where: { is_active: true },
      take: items,
      skip: items * (page - 1),
    });

    const totalCount = await this.prisma.event.count({
      where: { is_active: true },
    });

    const maxPage = Math.ceil(totalCount / items);

    return { activeEvents, maxPage };
  }

  async addEvent(addEventDto: AddEventDto) {
    const formName = addEventDto.title.toLowerCase().split(' ').join('-');

    const event = await this.prisma.event.create({
      data: {
        title: addEventDto.title,
        requires_payment: addEventDto.requires_payment,
        description: addEventDto.description,
        date: addEventDto.date,
        form_name: formName,
      },
    });

    addEventDto.eventTiers.forEach(async (eventTier) => {
      await this.prisma.eventTierOnEvent.create({
        data: {
          eventId: event.id,
          eventTierId: eventTier.id,
          price: eventTier.price,
          max_participants: eventTier.max_participants,
          is_active: true,
        },
      });
    });
  }

  async getInactiveEvents(page = 1, items = 10) {
    const inactiveEvents = await this.prisma.event.findMany({
      where: { is_active: false },
      take: items,
      skip: items * (page - 1),
    });

    const totalCount = await this.prisma.event.count({
      where: { is_active: false },
    });

    const maxPage = Math.ceil(totalCount / items);

    return { inactiveEvents, maxPage };
  }

  async editEvent(id: number, editEventDto: EditEventsDto) {
    const formName = editEventDto.title.toLowerCase().split(' ').join('-');
    await this.prisma.event.update({
      data: {
        title: editEventDto.title,
        requires_payment: editEventDto.requires_payment,
        description: editEventDto.description,
        date: editEventDto.date,
        form_name: formName,
      },
      where: { id },
    });
    editEventDto.eventTiers.forEach(async (eventTier) => {
      await this.prisma.eventTierOnEvent.updateMany({
        data: {
          price: eventTier.price,
          max_participants: eventTier.max_participants,
        },
        where: { eventId: id, eventTierId: eventTier.id },
      });
    });
  }

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

  async getEventTiers(eventId: number) {
    const eventTiers = await this.prisma.event.findFirst({
      where: { id: eventId },
      include: {
        eventTierOnEvent: {
          include: {
            eventTier: true,
          },
        },
      },
    });

    const eventTiersToReturn = eventTiers.eventTierOnEvent.map(
      (eventTierOnEvent) => {
        return {
          ...eventTierOnEvent.eventTier,
        };
      },
    );

    return eventTiersToReturn;
  }
}
