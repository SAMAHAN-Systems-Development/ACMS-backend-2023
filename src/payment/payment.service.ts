import { Injectable } from '@nestjs/common';
import { Payment } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async findAllAccepted(): Promise<Payment[]> {
    return this.prisma.payment.findMany({ where: { status: 'accepted' } });
  }
}
