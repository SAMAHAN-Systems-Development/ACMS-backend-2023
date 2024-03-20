import { Injectable, NotFoundException } from '@nestjs/common';
import { Student } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async acceptPayments(paymentIds: number[]) {
    await this.prisma.payment.updateMany({
      data: {
        status: 'accepted',
      },
      where: { id: { in: paymentIds } },
    });
  }

  async declinePayments(paymentIds: number[]) {
    await this.prisma.payment.updateMany({
      data: {
        status: 'declined',
      },
      where: { id: { in: paymentIds } },
    });
  }

  async getAllAcceptedPayments(
    page = 1,
    items = 10,
  ): Promise<{ acceptedPayments: Student[]; maxPage: number }> {
    const acceptedPayments = await this.prisma.student.findMany({
      include: {
        payment: true,
        eventTierOnEvent: {
          include: {
            event: true,
          },
        },
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

  // async getEventAcceptedPayments(
  //   eventId: number,
  //   page = 1,
  //   items = 10,
  // ): Promise<{ acceptedPayments: Student[]; maxPage: number }> {
  //   const skipItems = items * (page - 1);

  //   const acceptedPayments = await this.prisma.student.findMany({
  //     include: {
  //       event: true,
  //       payment: true,
  //     },
  //     where: {
  //       event: {
  //         id: eventId,
  //       },
  //       payment: {
  //         status: 'accepted',
  //       },
  //     },
  //     take: items,
  //     skip: skipItems,
  //   });

  //   const totalCount = await this.prisma.student.count({
  //     where: {
  //       event: {
  //         id: eventId,
  //       },
  //       payment: {
  //         status: 'accepted',
  //       },
  //     },
  //   });

  //   const maxPage = Math.ceil(totalCount / items);

  //   return { acceptedPayments, maxPage };
  // }

  // async getAllDeclinedPayments(
  //   page = 1,
  //   items = 10,
  // ): Promise<{ declinedPayments: Student[]; maxPage: number }> {
  //   const declinedPayments = await this.prisma.student.findMany({
  //     include: {
  //       payment: {},
  //       event: {},
  //     },
  //     where: {
  //       payment: {
  //         status: 'declined',
  //       },
  //     },
  //     take: items,
  //     skip: items * (page - 1),
  //   });

  //   const totalCount = await this.prisma.student.count({
  //     where: {
  //       payment: {
  //         status: 'declined',
  //       },
  //     },
  //   });
  //   const maxPage = Math.ceil(totalCount / items);

  //   return { declinedPayments, maxPage };
  // }

  // async getEventDeclinedPayments(
  //   eventId: number,
  //   page = 1,
  //   items = 10,
  // ): Promise<{ declinedPayments: Student[]; maxPage: number }> {
  //   const skipItems = items * (page - 1);

  //   const declinedPayments = await this.prisma.student.findMany({
  //     include: {
  //       event: true,
  //       payment: true,
  //     },
  //     where: {
  //       event: {
  //         id: eventId,
  //       },
  //       payment: {
  //         status: 'declined',
  //       },
  //     },
  //     take: items,
  //     skip: skipItems,
  //   });

  //   const totalCount = await this.prisma.student.count({
  //     where: {
  //       event: {
  //         id: eventId,
  //       },
  //       payment: {
  //         status: 'declined',
  //       },
  //     },
  //   });

  //   const maxPage = Math.ceil(totalCount / items);

  //   return { declinedPayments, maxPage };
  // }

  // async getAllPendingPayments(
  //   page = 1,
  //   items = 10,
  // ): Promise<{ pendingPayments: Student[]; maxPage: number }> {
  //   const pendingPayments = await this.prisma.student.findMany({
  //     include: {
  //       payment: {},
  //       event: {},
  //     },
  //     where: {
  //       payment: {
  //         status: 'pending',
  //       },
  //     },
  //     take: items,
  //     skip: items * (page - 1),
  //   });

  //   const totalCount = await this.prisma.student.count({
  //     where: {
  //       payment: {
  //         status: 'pending',
  //       },
  //     },
  //   });
  //   const maxPage = Math.ceil(totalCount / items);

  //   return { pendingPayments, maxPage };
  // }

  // async getEventPendingPayments(
  //   eventId: number,
  //   page = 1,
  //   items = 10,
  // ): Promise<{ pendingPayments: Student[]; maxPage: number }> {
  //   const skipItems = items * (page - 1);

  //   const pendingPayments = await this.prisma.student.findMany({
  //     include: {
  //       event: true,
  //       payment: true,
  //     },
  //     where: {
  //       event: {
  //         id: eventId,
  //       },
  //       payment: {
  //         status: 'pending',
  //       },
  //     },
  //     take: items,
  //     skip: skipItems,
  //   });

  //   const totalCount = await this.prisma.student.count({
  //     where: {
  //       event: {
  //         id: eventId,
  //       },
  //       payment: {
  //         status: 'pending',
  //       },
  //     },
  //   });

  //   const maxPage = Math.ceil(totalCount / items);

  //   return { pendingPayments, maxPage };
  // }

  // async restorePayments(paymentIds: number[]) {
  //   const pendingPayments = await this.prisma.payment.updateMany({
  //     where: {
  //       id: {
  //         in: paymentIds,
  //       },
  //     },
  //     data: {
  //       status: 'pending',
  //     },
  //   });
  // }
}
