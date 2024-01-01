import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ReadStudentDto } from './dto/read-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  create(createStudentDto: CreateStudentDto) {
    const testStudent = this.prisma.testModel.create({
      data: createStudentDto,
    });

    return testStudent;
  }

  findAll() {
    return `This action returns all student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }

  async getStudentByUuid(uuid: string): Promise<ReadStudentDto> {
    const student = await this.prisma.student.findUnique({
      where: { uuid },
      select: {
        uuid: true,
        firstName: true,
        lastName: true,
        email: true,
        year_and_course: true,
        event: {
          select: {
            createdAt: true,
            updatedAt: true,
            title: true,
            price: true,
            requires_payment: true,
            max_participants: true,
            description: true,
            date: true,
            is_active: true,
            form_name: true,
          },
        },
        payment: {
          select: {
            createdAt: true,
            updatedAt: true,
            photo_src: true,
            status: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }
}
