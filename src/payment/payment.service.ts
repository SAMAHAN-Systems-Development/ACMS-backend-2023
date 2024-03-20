import { Injectable } from '@nestjs/common';
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

  async getAllAcceptedPayments(page = 1, items = 10) {
    const acceptedPayments = await this.prisma.payment.findMany({
      include: {
        student: {
          include: {
            eventTierOnEvent: {
              include: {
                event: true,
                eventTier: true,
              },
            },
          },
        },
      },
      where: {
        status: 'accepted',
      },
      take: items,
      skip: items * (page - 1),
    });

    const toReturnAcceptedPayments = acceptedPayments.map((acceptedPayment) => {
      const finalAcceptedPayment = {
        ...acceptedPayment,
        event: acceptedPayment.student.eventTierOnEvent.event,
        eventTier: acceptedPayment.student.eventTierOnEvent.eventTier,
        eventPrice: acceptedPayment.student.is_addu_student
          ? acceptedPayment.student.eventTierOnEvent.adduPrice
          : acceptedPayment.student.eventTierOnEvent.nonAdduPrice,
      };

      delete finalAcceptedPayment.student.eventTierOnEvent;

      return finalAcceptedPayment;
    });

    const totalCount = await this.prisma.payment.count({
      where: {
        status: 'accepted',
      },
    });
    const maxPage = Math.ceil(totalCount / items);

    return {
      acceptedPayments: toReturnAcceptedPayments,
      maxPage,
    };
  }

  async getEventAcceptedPayments(eventId: number, page = 1, items = 10) {
    const acceptedPayments = await this.prisma.payment.findMany({
      include: {
        student: {
          include: {
            eventTierOnEvent: {
              include: {
                event: true,
                eventTier: true,
              },
            },
          },
        },
      },
      where: {
        status: 'accepted',
        student: {
          is: {
            eventTierOnEvent: {
              is: {
                eventId: eventId,
              },
            },
          },
        },
      },
      take: items,
      skip: items * (page - 1),
    });

    const toReturnAcceptedPayments = acceptedPayments.map((acceptedPayment) => {
      const finalAcceptedPayment = {
        ...acceptedPayment,
        event: acceptedPayment.student.eventTierOnEvent.event,
        eventTier: acceptedPayment.student.eventTierOnEvent.eventTier,
        eventPrice: acceptedPayment.student.is_addu_student
          ? acceptedPayment.student.eventTierOnEvent.adduPrice
          : acceptedPayment.student.eventTierOnEvent.nonAdduPrice,
      };

      delete finalAcceptedPayment.student.eventTierOnEvent;

      return finalAcceptedPayment;
    });

    const totalCount = await this.prisma.payment.count({
      where: {
        status: 'accepted',
        student: {
          is: {
            eventTierOnEvent: {
              is: {
                eventId: eventId,
              },
            },
          },
        },
      },
    });
    const maxPage = Math.ceil(totalCount / items);

    return {
      acceptedPayments: toReturnAcceptedPayments,
      maxPage,
    };
  }

  async getAllDeclinedPayments(page = 1, items = 10) {
    const declinedPayments = await this.prisma.payment.findMany({
      include: {
        student: {
          include: {
            eventTierOnEvent: {
              include: {
                event: true,
                eventTier: true,
              },
            },
          },
        },
      },
      where: {
        status: 'declined',
      },
      take: items,
      skip: items * (page - 1),
    });

    const toReturnDeclinedPayments = declinedPayments.map((declinedPayment) => {
      const finalDeclinedPayment = {
        ...declinedPayment,
        event: declinedPayment.student.eventTierOnEvent.event,
        eventTier: declinedPayment.student.eventTierOnEvent.eventTier,
        eventPrice: declinedPayment.student.is_addu_student
          ? declinedPayment.student.eventTierOnEvent.adduPrice
          : declinedPayment.student.eventTierOnEvent.nonAdduPrice,
      };

      delete finalDeclinedPayment.student.eventTierOnEvent;

      return finalDeclinedPayment;
    });

    const totalCount = await this.prisma.payment.count({
      where: {
        status: 'declined',
      },
    });
    const maxPage = Math.ceil(totalCount / items);

    return {
      declinedPayments: toReturnDeclinedPayments,
      maxPage,
    };
  }

  async getEventDeclinedPayments(eventId: number, page = 1, items = 10) {
    const declinedPayments = await this.prisma.payment.findMany({
      include: {
        student: {
          include: {
            eventTierOnEvent: {
              include: {
                event: true,
                eventTier: true,
              },
            },
          },
        },
      },
      where: {
        status: 'declined',
        student: {
          is: {
            eventTierOnEvent: {
              is: {
                eventId: eventId,
              },
            },
          },
        },
      },
      take: items,
      skip: items * (page - 1),
    });

    const toReturnDeclinedPayments = declinedPayments.map((declinedPayment) => {
      const finalDeclinedPayment = {
        ...declinedPayment,
        event: declinedPayment.student.eventTierOnEvent.event,
        eventTier: declinedPayment.student.eventTierOnEvent.eventTier,
        eventPrice: declinedPayment.student.is_addu_student
          ? declinedPayment.student.eventTierOnEvent.adduPrice
          : declinedPayment.student.eventTierOnEvent.nonAdduPrice,
      };

      delete finalDeclinedPayment.student.eventTierOnEvent;

      return finalDeclinedPayment;
    });

    const totalCount = await this.prisma.payment.count({
      where: {
        status: 'declined',
        student: {
          is: {
            eventTierOnEvent: {
              is: {
                eventId: eventId,
              },
            },
          },
        },
      },
    });
    const maxPage = Math.ceil(totalCount / items);

    return {
      declinedPayments: toReturnDeclinedPayments,
      maxPage,
    };
  }

  async getAllPendingPayments(page = 1, items = 10) {
    const pendingPayments = await this.prisma.payment.findMany({
      include: {
        student: {
          include: {
            eventTierOnEvent: {
              include: {
                event: true,
                eventTier: true,
              },
            },
          },
        },
      },
      where: {
        status: 'pending',
      },
      take: items,
      skip: items * (page - 1),
    });

    const toReturnPendingPayments = pendingPayments.map((pendingPayment) => {
      const finalPendingPayment = {
        ...pendingPayment,
        event: pendingPayment.student.eventTierOnEvent.event,
        eventTier: pendingPayment.student.eventTierOnEvent.eventTier,
        eventPrice: pendingPayment.student.is_addu_student
          ? pendingPayment.student.eventTierOnEvent.adduPrice
          : pendingPayment.student.eventTierOnEvent.nonAdduPrice,
      };

      delete finalPendingPayment.student.eventTierOnEvent;

      return finalPendingPayment;
    });

    const totalCount = await this.prisma.payment.count({
      where: {
        status: 'pending',
      },
    });
    const maxPage = Math.ceil(totalCount / items);

    return {
      pendingPayments: toReturnPendingPayments,
      maxPage,
    };
  }

  async getEventPendingPayments(eventId: number, page = 1, items = 10) {
    const pendingPayments = await this.prisma.payment.findMany({
      include: {
        student: {
          include: {
            eventTierOnEvent: {
              include: {
                event: true,
                eventTier: true,
              },
            },
          },
        },
      },
      where: {
        status: 'pending',
        student: {
          is: {
            eventTierOnEvent: {
              is: {
                eventId: eventId,
              },
            },
          },
        },
      },
      take: items,
      skip: items * (page - 1),
    });

    const toReturnPendingPayments = pendingPayments.map((pendingPayment) => {
      const finalPendingPayment = {
        ...pendingPayment,
        event: pendingPayment.student.eventTierOnEvent.event,
        eventTier: pendingPayment.student.eventTierOnEvent.eventTier,
        eventPrice: pendingPayment.student.is_addu_student
          ? pendingPayment.student.eventTierOnEvent.adduPrice
          : pendingPayment.student.eventTierOnEvent.nonAdduPrice,
      };

      delete finalPendingPayment.student.eventTierOnEvent;

      return finalPendingPayment;
    });

    const totalCount = await this.prisma.payment.count({
      where: {
        status: 'pending',
        student: {
          is: {
            eventTierOnEvent: {
              is: {
                eventId: eventId,
              },
            },
          },
        },
      },
    });
    const maxPage = Math.ceil(totalCount / items);

    return {
      pendingPayments: toReturnPendingPayments,
      maxPage,
    };
  }

  async restorePayments(paymentIds: number[]) {
    const pendingPayments = await this.prisma.payment.updateMany({
      where: {
        id: {
          in: paymentIds,
        },
      },
      data: {
        status: 'pending',
      },
    });
    return pendingPayments;
  }
}
