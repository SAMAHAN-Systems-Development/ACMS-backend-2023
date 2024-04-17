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

  async getAllAcceptedPayments(page = 1, studentName = '', items = 10) {
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
          firstName: {
            startsWith: studentName,
            mode: 'insensitive',
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
        eventPrice: acceptedPayment.required_payment,
      };

      return finalAcceptedPayment;
    });

    const totalCount = await this.prisma.payment.count({
      where: {
        status: 'accepted',
        student: {
          firstName: {
            startsWith: studentName,
            mode: 'insensitive',
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
        eventPrice: acceptedPayment.required_payment,
      };

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

  async getAllDeclinedPayments(page = 1, studentName = '', items = 10) {
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
          firstName: {
            startsWith: studentName,
            mode: 'insensitive',
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
        eventPrice: declinedPayment.required_payment,
      };

      return finalDeclinedPayment;
    });

    const totalCount = await this.prisma.payment.count({
      where: {
        status: 'declined',
        student: {
          firstName: {
            startsWith: studentName,
            mode: 'insensitive',
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
        eventPrice: declinedPayment.required_payment,
      };

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

  async getAllPendingPayments(page = 1, studentName = '', items = 10) {
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
          firstName: {
            startsWith: studentName,
            mode: 'insensitive',
          },
        },
      },
      take: items,
      skip: items * (page - 1),
    });

    const filteredPendingPayments = pendingPayments.filter((pendingPayment) => {
      const event = pendingPayment?.student?.eventTierOnEvent?.event;
      const eventTier = pendingPayment?.student?.eventTierOnEvent?.eventTier;

      if (!event || !eventTier) {
        return false;
      }
      return true;
    });

    const toReturnPendingPayments = filteredPendingPayments.map(
      (pendingPayment) => {
        const event = pendingPayment?.student?.eventTierOnEvent?.event;
        const eventTier = pendingPayment?.student?.eventTierOnEvent?.eventTier;

        if (!event || !eventTier) {
          console.log(pendingPayment);
          return this.sampleData;
        }

        const finalPendingPayment = {
          ...pendingPayment,
          event: event,
          eventTier: eventTier,
          eventPrice: pendingPayment.required_payment,
        };

        return finalPendingPayment;
      },
    );

    const totalCount = await this.prisma.payment.count({
      where: {
        status: 'pending',
        student: {
          firstName: {
            startsWith: studentName,
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
        eventPrice: pendingPayment.required_payment,
      };

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

  sampleData = {
    id: 100,
    createdAt: '2024-04-05T09:44:19.984Z',
    updatedAt: '2024-04-10T14:23:41.277Z',
    photo_src:
      'https://fjqloxpyknqccretzoyt.supabase.co/storage/v1/object/public/payment/yxbcua_2BS%20Chemical%20Engineering_E1',
    status: 'pending',
    required_payment: 500,
    student: {
      id: 87,
      createdAt: '2024-04-05T09:44:20.119Z',
      updatedAt: '2024-04-05T09:44:20.119Z',
      uuid: '14c4ec3d-c884-4b96-94fa-658c0f379bb2',
      firstName: 'FAKE DATA',
      lastName: 'FAKE DATA',
      email: 'FAKE_DATA@gmail.com',
      year_and_course: 'FAKE DATA',
      requires_payment: true,
      paymentId: 100,
      eventTierOnEventId: 4,
      is_addu_student: true,
      control_number: 'MADAYAW0103020',
      eventTierOnEvent: {
        id: 4,
        createdAt: '2024-03-30T08:25:02.334Z',
        updatedAt: '2024-04-01T16:31:42.147Z',
        eventId: 1,
        eventTierId: 4,
        earlyBirdPrice: 0,
        originalPrice: 500,
        max_participants: 50,
        is_active: true,
        event: {
          id: 1,
          createdAt: '2024-03-30T08:25:02.247Z',
          updatedAt: '2024-04-07T09:01:05.199Z',
          title: 'Madayaw Nights 2024 Early Bird',
          description:
            'The Early Bird edition for the Madayaw Nights 2024 Event',
          date: '2024-04-20T00:00:00.000Z',
          is_active: true,
          form_name: 'madayaw-nights-2024-early-bird',
          requires_payment: true,
          earlyBirdAccessDate: '2024-03-31T00:00:00.000Z',
          hasEarlyBirdAccess: false,
        },
        eventTier: {
          id: 4,
          createdAt: '2024-03-30T08:04:08.094Z',
          updatedAt: '2024-03-30T08:04:08.094Z',
          name: 'Bronze',
          is_active: true,
        },
      },
    },
    event: {
      id: 1,
      createdAt: '2024-03-30T08:25:02.247Z',
      updatedAt: '2024-04-07T09:01:05.199Z',
      title: 'Madayaw Nights 2024 Early Bird',
      description: 'The Early Bird edition for the Madayaw Nights 2024 Event',
      date: '2024-04-20T00:00:00.000Z',
      is_active: true,
      form_name: 'madayaw-nights-2024-early-bird',
      requires_payment: true,
      earlyBirdAccessDate: '2024-03-31T00:00:00.000Z',
      hasEarlyBirdAccess: false,
    },
    eventTier: {
      id: 4,
      createdAt: '2024-03-30T08:04:08.094Z',
      updatedAt: '2024-03-30T08:04:08.094Z',
      name: 'Bronze',
      is_active: true,
    },
    eventPrice: 500,
  };
}
