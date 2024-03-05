import {
  FileTypeValidator,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ReadStudentDto } from './dto/read-student.dto';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseService } from 'supabase/supabase.service';
import { EmailSender } from 'src/emailSender/EmailSender';
import * as qrcode from 'qrcode';

@Injectable()
export class StudentService {
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

  async createStudent(createStudentDto: CreateStudentDto) {
    const payment = await this.createPayment(
      createStudentDto.photo_src,
      createStudentDto.isSubmittedByStudent,
    );
    const uuid = uuidv4();
    const requires_payment =
      createStudentDto.isSubmittedByStudent &&
      createStudentDto.event_requires_payment;

    const newStudent = this.prisma.student.create({
      data: {
        uuid: uuid,
        firstName: createStudentDto.firstName,
        lastName: createStudentDto.lastName,
        email: createStudentDto.email,
        year_and_course: createStudentDto.year_and_course,
        paymentId: payment.id,
        eventId: createStudentDto.eventId,
        requires_payment: requires_payment,
      },
    });

    const qrCode = await qrcode.toDataURL(uuid, {
      scale: 10,
    });
    this.emailSender.sendEmail(
      createStudentDto.photo_src,
      qrCode,
      createStudentDto.email,
      requires_payment,
    );
    return newStudent;

    // this.ValidateFileType(file);
    // const payment_path = await this.supabaseService.uploadImageToDB(file, uuid);
    // createStudentDto.uuid = uuid;
    // createStudentDto.paymentId = payment.id;
    // converts eventId to Number, because
    // http body can only accept Strings
    // createStudentDto.eventId = Number(createStudentDto.eventId);
    // let newStudent;
    // try {
    //   newStudent = this.prisma.student.create({
    //     data: createStudentDto,
    //   });
    //   console.log(uuid);

    //   return newStudent;
    // } catch (ex) {
    //   console.log(ex);
    //   return;
    // }
  }

  async findAll() {
    const users = await this.prisma.student.findMany();
    return users;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }

  async getStudentByUuid(uuid: string): Promise<ReadStudentDto> {
    try {
      return await this.prisma.student.findUnique({
        where: { uuid },
        include: { event: true, payment: true },
      });
    } catch (error) {
      throw new NotFoundException('Student Not Found');
    }
  }

  async getStudentByUuidAndEventId(
    uuid: string,
    eventId: number,
  ): Promise<ReadStudentDto> {
    try {
      const student = await this.prisma.student.findUnique({
        where: { uuid, eventId },
        include: { event: true, payment: true },
      });

      if (student.requires_payment) {
        if (student.payment.status === 'accepted') {
          return student;
        }
        throw new HttpException('Payment is still pending', 403);
      }
      return student;
    } catch (error) {
      throw new NotFoundException('Student Not Found');
    }
  }
}
