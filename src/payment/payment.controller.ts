import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from '@prisma/client';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('accepted')
  async findAllAccepted(@Query('page') page: number): Promise<Payment[]> {
    try {
      return this.paymentService.findAllAccepted(page);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Something went wrong',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
