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
  async GetAllAcceptedPayments(
    @Query('page') page: number,
  ): Promise<Payment[]> {
    try {
      return this.paymentService.findAllAcceptedPayments(page);
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

  @Get('declined')
  async GetAllDeclinedPayments(
    @Query('page') page: number,
  ): Promise<Payment[]> {
    try {
      return this.paymentService.findAllDeclinedPayments(page);
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
