import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseService } from 'supabase/supabase.service';
import { EmailSender } from 'src/emailSender/EmailSender';
import * as qrcode from 'qrcode';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import * as dayjs from 'dayjs';

@Injectable()
// @WebSocketGateway({
//   cors: {
//     origin: [process.env.FRONTEND_URL],
//   },
//   transports: ['websocket', 'polling'],
// })
export class StudentService {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly emailSender: EmailSender,
  ) {}

  async createPayment(
    payment_path: string,
    isRegisterByStudent: boolean,
    paymentPrice: number,
    payment_reference_number: string,
  ) {
    try {
      return await this.prisma.payment.create({
        data: {
          photo_src: payment_path,
          status: isRegisterByStudent ? 'pending' : 'accepted',
          required_payment: paymentPrice,
          reference_number: payment_reference_number,
        },
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  async createStudent(createStudentDto: CreateStudentDto) {
    let eventRequiresPayment = createStudentDto.event_requires_payment;
    const studentEmail = createStudentDto.email.toLowerCase();
    if (eventRequiresPayment === null) {
      const eventData = await this.prisma.event.findUnique({
        where: { id: createStudentDto.eventId },
        select: { requires_payment: true },
      });
      eventRequiresPayment = eventData.requires_payment;
    }

    const uuid = uuidv4();
    const requires_payment =
      createStudentDto.isSubmittedByStudent && eventRequiresPayment;

    const eventTierOnEvent = await this.prisma.eventTierOnEvent.findFirst({
      include: {
        _count: {
          select: {
            students: true,
          },
        },
        event: true,
        eventTier: true,
      },
      where: {
        eventId: createStudentDto.eventId,
        eventTierId: createStudentDto.eventTierId,
      },
    });

    const controlNumber = this.getControlNumber(
      eventTierOnEvent._count.students,
      createStudentDto.eventTierId,
      createStudentDto.eventId,
    );

    if (
      eventTierOnEvent.max_participants - eventTierOnEvent._count.students <=
      0
    ) {
      return { message: 'maxParticipantsReached' };
    }

    const studentCount = await this.prisma.student.aggregate({
      _count: true,
      where: {
        email: studentEmail,
        eventTierOnEvent: {
          is: {
            eventId: createStudentDto.eventId,
          },
        },
      },
    });

    if (studentCount._count >= 1) {
      return { message: 'emailIsExisting' };
    }

    const payment = await this.createPayment(
      createStudentDto.photo_src,
      createStudentDto.isSubmittedByStudent,
      createStudentDto.required_payment,
      createStudentDto.payment_reference_number,
    );

    const newStudent = this.prisma.student.create({
      data: {
        uuid: uuid,
        firstName: createStudentDto.firstName,
        lastName: createStudentDto.lastName,
        email: studentEmail,
        year_and_course: createStudentDto.year_and_course,
        paymentId: payment.id,
        requires_payment: requires_payment,
        eventTierOnEventId: eventTierOnEvent.id,
        is_addu_student: createStudentDto.is_addu_student,
        control_number: controlNumber,
        id_src: createStudentDto.id_src,
      },
    });

    const qrCode = await qrcode.toDataURL(uuid, {
      scale: 10,
    });
    this.emailSender.sendEmail(
      createStudentDto.photo_src,
      qrCode,
      studentEmail,
      requires_payment,
      controlNumber,
      dayjs(eventTierOnEvent.event.date).format('MMM DD, YYYY'),
      `${createStudentDto.firstName} ${createStudentDto.lastName}`,
      createStudentDto.year_and_course,
      createStudentDto.is_addu_student ? 'Atenean' : 'Non-Atenean',
      eventTierOnEvent.eventTier.name,
      this.moneyFormatter(createStudentDto.required_payment),
      uuid,
    );

    // this.sendTicketLeftWebsocketData(createStudentDto.eventId);

    return newStudent;
  }

  // async sendTicketLeftWebsocketData(eventId: number) {
  //   this.server.emit('sendStudentRegisteredSignal', eventId);
  // }

  async findAll() {
    const users = await this.prisma.student.findMany();
    return users;
  }

  async getStudentByUuid(uuid: string) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { uuid },
        include: {
          payment: true,
          eventTierOnEvent: { include: { event: true, eventTier: true } },
        },
      });
      const studentToReturn = {
        ...student,
        event: student.eventTierOnEvent.event,
        eventTier: student.eventTierOnEvent.eventTier,
      };

      delete studentToReturn.eventTierOnEvent;

      return studentToReturn;
    } catch (error) {
      throw new NotFoundException('Student Not Found');
    }
  }

  async getStudentByUuidAndEventId(uuid: string, eventId: number) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { uuid, eventTierOnEvent: { eventId } },
        include: {
          payment: true,
          eventTierOnEvent: { include: { event: true, eventTier: true } },
        },
      });
      const studentToReturn = {
        ...student,
        event: student.eventTierOnEvent.event,
        eventTier: student.eventTierOnEvent.eventTier,
      };

      delete studentToReturn.eventTierOnEvent;

      if (student.requires_payment) {
        if (student.payment.status === 'accepted') {
          return studentToReturn;
        }
        throw new HttpException('Payment is still pending', 403);
      }
      return studentToReturn;
    } catch (error) {
      throw new Error(error);
    }
  }

  getControlNumber(
    numberOfStudents: number,
    eventTierId: number,
    eventId: number,
  ) {
    const startingNumber = (eventTierId - 1) * 1000 + 1;
    const controlNumber = startingNumber + numberOfStudents;
    const studentNumber = String(controlNumber).padStart(5, '0');
    const eventNumber = String(eventId).padStart(2, '0');
    return `MADAYAW${eventNumber}${studentNumber}`;
  }

  moneyFormatter(money: number) {
    return `Php. ${money.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`;
  }
}
