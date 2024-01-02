import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async findAll() {
    const users = await this.prisma.student.findMany();
    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
