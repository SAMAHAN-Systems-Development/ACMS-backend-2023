import { Injectable } from '@nestjs/common';
import { Student } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async getAllAcceptedPayments(page = 1, items = 10): Promise<Student[]> {
    return this.prisma.student.findMany({
      include: {
        payment: {},
        event: {},
      },
      where: {
        payment: {
          status: 'accepted',
        },
      },
      take: items,
      skip: items * (page - 1),
    });
  }

  async getEventAcceptedPayments(
    eventId: number,
    page = 1,
    items = 10,
  ): Promise<Student[]> {
    const skipItems = items * (page - 1);

    const acceptedPayments = await this.prisma.student.findMany({
      include: {
        event: true,
        payment: true,
      },
      where: {
        event: {
          id: eventId,
        },
        payment: {
          status: 'accepted',
        },
      },
      take: items,
      skip: skipItems,
    });

    return acceptedPayments;
  }

  async getAllDeclinedPayments(page = 1, items = 10): Promise<Student[]> {
    return this.prisma.student.findMany({
      include: {
        payment: {},
        event: {},
      },
      where: {
        payment: {
          status: 'declined',
        },
      },
      take: items,
      skip: items * (page - 1),
    });
  }

  async getEventDeclinedPayments(
    eventId: number,
    page = 1,
    items = 10,
  ): Promise<Student[]> {
    const skipItems = items * (page - 1);

    const declinedPayments = await this.prisma.student.findMany({
      include: {
        event: true,
        payment: true,
      },
      where: {
        event: {
          id: eventId,
        },
        payment: {
          status: 'declined',
        },
      },
      take: items,
      skip: skipItems,
    });

    return declinedPayments;
  }

  async getAllPendingPayments(page = 1, items = 10): Promise<Student[]> {
    return this.prisma.student.findMany({
      include: {
        payment: {},
        event: {},
      },
      where: {
        payment: {
          status: 'pending',
        },
      },
      take: items,
      skip: items * (page - 1),
    });
  }

  async getEventPendingPayments(
    eventId: number,
    page = 1,
    items = 10,
  ): Promise<Student[]> {
    const skipItems = items * (page - 1);

    const pendingPayments = await this.prisma.student.findMany({
      include: {
        event: true,
        payment: true,
      },
      where: {
        event: {
          id: eventId,
        },
        payment: {
          status: 'pending',
        },
      },
      take: items,
      skip: skipItems,
    });

    return pendingPayments;
  }
}
