import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ReadStudentDto } from './dto/read-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  getPaymentById(createStudentDto) {
    return this.prisma.payment.findUnique({
      where: {
        id: createStudentDto.paymentId,
      },
    });
  }

  async createPayment(payment_path: string, isRegisterByStudent: boolean) {
    const newPayment = await this.prisma.payment.create({
      data: {
        photo_src: payment_path,
        // if submission is by student, put in pending status
        // until cashier accepts payment
        // else submission is by cashier, accepted status
        status: isRegisterByStudent ? 'pending' : 'accepted',
      },
    });
    return newPayment;
  }

  async createEvent() {
    const newEvent = await this.prisma.event.create({
      data: {
        title: '',
        price: '',
        max_participants: 1,
        requires_payment: true,
        description: '',
        date: new Date(),
        is_active: true,
        form_name: '',
      },
    });
    return newEvent;
  }

  async createStudent(
    createStudentDto: CreateStudentDto,
    file: Express.Multer.File,
  ) {
    const uuid = uuidv4();
    const payment_path = this.uploadImageToDB(file, uuid);
    createStudentDto.uuid = uuid;
    const isStudent = true;
    const payment = await this.createPayment(await payment_path, isStudent);
    const event = await this.createEvent();
    createStudentDto.paymentId = payment.id;
    createStudentDto.eventId = event.id;
    const newStudent = this.prisma.student.create({
      data: createStudentDto,
    });
    return newStudent;
  }

  toBase64(file: Express.Multer.File) {
    return Buffer.from(file.buffer).toString('base64');
  }

  async uploadImageToDB(file: Express.Multer.File, uuid: string) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const bucketName = 'payment';
    // the generated file name when
    // image is uploaded to supabase
    const file_name = `${uuid}_receipt.png`;
    const payment_path = `${bucketName}${file_name}`;
    // converts file to base64 string
    // supabase has limitations in uploading files
    // without converting to Base64, causes uploaded file to be incorrectly
    // uploaded with missing details in supabase
    const base64 = this.toBase64(file);
    await supabase.storage.from(bucketName).upload(file_name, decode(base64), {
      contentType: 'image/jpg',
    });
    return payment_path;
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
