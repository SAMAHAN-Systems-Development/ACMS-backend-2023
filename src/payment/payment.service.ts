import { Injectable } from '@nestjs/common';
import { Payment } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async findAllAcceptedPayments(page = 1, items = 10): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { status: 'accepted' },
      take: items,
      skip: items * (page - 1),
    });
  }

  async findAllDeclinedPayments(page = 1, items = 10): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { status: 'declined' },
      take: items,
      skip: items * (page - 1),
    });
  }

}
