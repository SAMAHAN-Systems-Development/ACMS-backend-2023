import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddEventDto } from './dto/add-event.dto';
import { EditEventsDto } from './dto/edit-event.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async viewEvent(
    eventId: number,
    studentPage = 1,
    studentSearchValue = '',
    studentItems = 10,
  ) {
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
        OR: [
          {
            firstName: {
              startsWith: studentSearchValue,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              startsWith: studentSearchValue,
              mode: 'insensitive',
            },
          },
          {
            email: {
              startsWith: studentSearchValue,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: Number(studentItems),
      skip: Number(studentItems) * (studentPage - 1),
    });

    // const totalCount = await this.prisma.student.findMany({
    //   where: {
    //     status: 'accepted',
    //     OR: [
    //       {
    //         student: {
    //           firstName: {
    //             startsWith: studentName,
    //             mode: 'insensitive',
    //           },
    //         },
    //       },
    //       {
    //         student: {
    //           lastName: {
    //             startsWith: studentName,
    //             mode: 'insensitive',
    //           },
    //         },
    //       },
    //       {
    //         student: {
    //           email: {
    //             startsWith: studentName,
    //             mode: 'insensitive',
    //           },
    //         },
    //       },
    //     ],
    //   },
    // });
    // const maxPage = Math.ceil(totalCount / items);

    const eventToReturn = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      is_active: event.is_active,
      form_name: event.form_name,
      requires_payment: event.requires_payment,
      earlyBirdAccessDate: event.earlyBirdAccessDate,
      hasEarlyBirdAccess: event.hasEarlyBirdAccess,
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
          is_addu_student: student.is_addu_student,
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
          earlyBirdPrice: eventTierOnEvent.earlyBirdPrice,
          originalPrice: eventTierOnEvent.originalPrice,
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

    const earlyBirdAccessDate = dayjs(
      `${addEventDto.earlyBirdAccessDate.split('T')[0]}T00:00:00.000Z`,
    );

    const date = dayjs(`${addEventDto.date.split('T')[0]}T00:00:00.000Z`);

    const event = await this.prisma.event.create({
      data: {
        title: addEventDto.title,
        requires_payment: addEventDto.requires_payment,
        description: addEventDto.description,
        date: date.toDate(),
        form_name: formName,
        earlyBirdAccessDate: earlyBirdAccessDate.toDate(),
        hasEarlyBirdAccess: addEventDto.hasEarlyBirdAccess,
      },
    });

    addEventDto.eventTiers.forEach(async (eventTier) => {
      await this.prisma.eventTierOnEvent.create({
        data: {
          eventId: event.id,
          eventTierId: eventTier.id,
          earlyBirdPrice: eventTier.earlyBirdPrice,
          originalPrice: eventTier.originalPrice,
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

    const earlyBirdAccessDate = dayjs(
      `${editEventDto.earlyBirdAccessDate.split('T')[0]}T00:00:00.000Z`,
    );

    const date = dayjs(`${editEventDto.date.split('T')[0]}T00:00:00.000Z`);

    await this.prisma.event.update({
      data: {
        title: editEventDto.title,
        requires_payment: editEventDto.requires_payment,
        description: editEventDto.description,
        date: date.toDate(),
        form_name: formName,
        earlyBirdAccessDate: earlyBirdAccessDate.toDate(),
        hasEarlyBirdAccess: editEventDto.hasEarlyBirdAccess,
      },
      where: { id },
    });
    editEventDto.eventTiers.forEach(async (eventTier) => {
      await this.prisma.eventTierOnEvent.updateMany({
        data: {
          earlyBirdPrice: eventTier.earlyBirdPrice,
          originalPrice: eventTier.originalPrice,
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
