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
