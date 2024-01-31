import { Injectable, NotFoundException } from '@nestjs/common';
import { Student } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async acceptPayments(paymentIds: number[]): Promise<Student[]> {
    const pendingPayments = await this.prisma.student.findMany({
      where: {
        payment: {
          id: {
            in: paymentIds,
          },
          status: 'pending',
        },
      },
      include: {
        payment: {},
        event: {},
      },
    });

    if (!pendingPayments || pendingPayments.length === 0) {
      throw new NotFoundException('No pending payments found.');
    }

    const acceptedPayments: Student[] = [];

    for (const pendingPayment of pendingPayments) {
      const acceptedPayment = await this.prisma.student.update({
        where: {
          id: pendingPayment.id,
        },
        data: {
          payment: {
            update: {
              status: 'accepted',
            },
          },
        },
        include: {
          payment: {},
          event: {},
        },
      });

      acceptedPayments.push(acceptedPayment);
    }

    return acceptedPayments;
  }

  async declinePayments(paymentIds: number[]): Promise<Student[]> {
    const pendingPayments = await this.prisma.student.findMany({
      where: {
        payment: {
          id: {
            in: paymentIds,
          },
          status: 'pending',
        },
      },
      include: {
        payment: {},
        event: {},
      },
    });

    if (!pendingPayments || pendingPayments.length === 0) {
      throw new NotFoundException('No pending payments found.');
    }

    const declinedPayments: Student[] = [];

    for (const pendingPayment of pendingPayments) {
      const declinedPayment = await this.prisma.student.update({
        where: {
          id: pendingPayment.id,
        },
        data: {
          payment: {
            update: {
              status: 'declined',
            },
          },
        },
        include: {
          payment: {},
          event: {},
        },
      });

      declinedPayments.push(declinedPayment);
    }

    return declinedPayments;
  }

  async getAllAcceptedPayments(
    page = 1,
    items = 10,
  ): Promise<{ acceptedPayments: Student[]; maxPage: number }> {
    const acceptedPayments = await this.prisma.student.findMany({
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

    const totalCount = await this.prisma.student.count({
      where: {
        payment: {
          status: 'accepted',
        },
      },
    });
    const maxPage = Math.ceil(totalCount / items);

    return {
      acceptedPayments,
      maxPage,
    };
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

  async getAllDeclinedPayments(
    page = 1,
    items = 10,
  ): Promise<{ declinedPayments: Student[]; maxPage: number }> {
    const declinedPayments = await this.prisma.student.findMany({
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

    const totalCount = await this.prisma.student.count({
      where: {
        payment: {
          status: 'declined',
        },
      },
    });
    const maxPage = Math.ceil(totalCount / items);

    return { declinedPayments, maxPage };
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

  async restorePayments(paymentIds: number[]) {
    return await this.prisma.payment.updateMany({
      where: {
        id: {
          in: paymentIds,
        },
      },
      data: {
        status: 'pending',
      },
    });
  }
}
