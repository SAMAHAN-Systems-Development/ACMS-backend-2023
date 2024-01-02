import { Injectable } from '@nestjs/common';
import { Student } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async findAllAcceptedPayments(page = 1, items = 10): Promise<Student[]> {
    return this.prisma.student.findMany({
      include: {
        payment: {},
        event: {},
      },
      where: {
        payment: {
          status: 'accepted',
        }
      },
      take: items,
      skip: items * (page - 1),
    });
  }

}
