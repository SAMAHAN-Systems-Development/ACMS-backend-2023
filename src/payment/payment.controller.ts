import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from '@prisma/client';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('accepted')
  async findAllAccepted(): Promise<Payment[]> {
    try {
      return this.paymentService.findAllAccepted();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
