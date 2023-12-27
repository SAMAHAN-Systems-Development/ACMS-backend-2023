import { Injectable } from '@nestjs/common';
import { Payment } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async findAllAccepted(page = 1): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { status: 'accepted' },
      take: 10,
      skip: 10 * (page - 1),
    });
  }
}
