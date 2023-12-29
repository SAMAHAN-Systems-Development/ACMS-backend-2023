import { Injectable } from '@nestjs/common';
import { Payment } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async findAllAccepted(page = 1, items = 10): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { status: 'accepted' },
      take: items,
      skip: items * (page - 1),
    });
  }
}
