import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseService } from 'supabase/supabase.service';
import { EmailSender } from 'src/emailSender/EmailSender';
import * as qrcode from 'qrcode';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3001'],
  },
  transports: ['websocket', 'polling'],
})
export class StudentService {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly emailSender: EmailSender,
  ) {}

  async createPayment(payment_path: string, isRegisterByStudent: boolean) {
    try {
      return await this.prisma.payment.create({
        data: {
          photo_src: payment_path,
          // if submission is by student, put in pending status
          // until cashier accepts payment
          // else submission is by cashier, accepted status
          status: isRegisterByStudent ? 'pending' : 'accepted',
        },
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  // async createStudent(createStudentDto: CreateStudentDto) {
  //   let eventRequiresPayment = createStudentDto.event_requires_payment;
  //   if (eventRequiresPayment === null) {
  //     const eventData = await this.prisma.event.findUnique({
  //       where: { id: createStudentDto.eventId },
  //       select: { requires_payment: true },
  //     });
  //     eventRequiresPayment = eventData.requires_payment;
  //   }

  //   const payment = await this.createPayment(
  //     createStudentDto.photo_src,
  //     createStudentDto.isSubmittedByStudent,
  //   );
  //   const uuid = uuidv4();
  //   const requires_payment =
  //     createStudentDto.isSubmittedByStudent && eventRequiresPayment;

  //   const newStudent = this.prisma.student.create({
  //     data: {
  //       uuid: uuid,
  //       firstName: createStudentDto.firstName,
  //       lastName: createStudentDto.lastName,
  //       email: createStudentDto.email,
  //       year_and_course: createStudentDto.year_and_course,
  //       paymentId: payment.id,
  //       eventId: createStudentDto.eventId,
  //       requires_payment: requires_payment,
  //     },
  //   });

  //   const qrCode = await qrcode.toDataURL(uuid, {
  //     scale: 10,
  //   });
  //   this.emailSender.sendEmail(
  //     createStudentDto.photo_src,
  //     qrCode,
  //     createStudentDto.email,
  //     requires_payment,
  //   );

  //   this.sendTicketLeftWebsocketData();

  //   return newStudent;
  // }

  async createStudent() {
    this.sendTicketLeftWebsocketData();
  }

  async sendTicketLeftWebsocketData() {
    this.server.emit('ticketsLeft', 'hello');
  }

  async findAll() {
    const users = await this.prisma.student.findMany();
    return users;
  }

  // async getStudentByUuid(uuid: string) {
  //   try {
  //     return await this.prisma.student.findUnique({
  //       where: { uuid },
  //       include: { event: true, payment: true },
  //     });
  //   } catch (error) {
  //     throw new NotFoundException('Student Not Found');
  //   }
  // }

  // async getStudentByUuidAndEventId(uuid: string, eventId: number) {
  //   try {
  //     const student = await this.prisma.student.findUnique({
  //       where: { uuid, eventId },
  //       include: { event: true, payment: true },
  //     });

  //     if (student.requires_payment) {
  //       if (student.payment.status === 'accepted') {
  //         return student;
  //       }
  //       throw new HttpException('Payment is still pending', 403);
  //     }
  //     return student;
  //   } catch (error) {
  //     throw new NotFoundException('Student Not Found');
  //   }
  // }
}
