import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ReadStudentDto } from './dto/read-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import fs from 'fs';
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

  async createPayment() {
    const newPayment = await this.prisma.payment.create({
      data: {
        photo_src: '',
        status: '',
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

  async createStudent(createStudentDto: CreateStudentDto) {
    const payment = await this.createPayment();
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

  async uploadImage(file: Express.Multer.File, uuid: string) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const base64 = this.toBase64(file);

    const { data, error } = await supabase.storage
      .from('payment_url')
      .upload(`image_${Date.now()}.png`, decode(base64), {
        contentType: 'image/jpg',
      });
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
