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

  // validates image file uploaded
  // to check if its correct image type
  async ValidateFileType(file: Express.Multer.File) {
    const validator = new FileTypeValidator({
      fileType: /(jpg|jpeg|png|webp)$/,
    });
    if (validator.isValid(file)) {
      return file;
    } else {
      throw new HttpException('Uploaded file is not an image!', 400);
    }
  }

  async createStudent(
    createStudentDto: CreateStudentDto,
    file: Express.Multer.File,
  ) {
    this.ValidateFileType(file);
    const uuid = uuidv4();
    const payment_path = await this.supabaseService.uploadImageToDB(file, uuid);
    createStudentDto.uuid = uuid;
    // change this once OAuth is implemented.
    const isStudent = true;
    const payment = await this.createPayment(payment_path, isStudent);
    createStudentDto.paymentId = payment.id;
    // converts eventId to Number, because
    // http body can only accept Strings
    createStudentDto.eventId = Number(createStudentDto.eventId);
    let newStudent;
    try {
      newStudent = this.prisma.student.create({
        data: createStudentDto,
      });
      const receiptImgToBase64 = this.supabaseService.FiletoBase64(file);
      console.log(uuid);
      const qrCode = await qrcode.toDataURL(uuid, {
        scale: 10,
      });
      this.emailSender.sendEmail(
        receiptImgToBase64,
        qrCode,
        createStudentDto.email,
      );
      return newStudent;
    } catch (ex) {
      console.log(ex);
    }
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
}
