import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Student } from '@prisma/client';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('accepted')
  async getAllAcceptedPayments(
    @Query('page') page: number,
  ): Promise<Student[]> {
    try {
      return this.paymentService.getAllAcceptedPayments(page);
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

  @Get('accepted/:id')
  async getEventAcceptedPayments(
    @Param('id', ParseIntPipe) eventId: number,
    @Query('page') page: number,
  ): Promise<Student[]> {
    try {
      return await this.paymentService.getEventAcceptedPayments(eventId, page);
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Get('declined')
  async getAllDeclinedPayments(
    @Query('page') page: number,
  ): Promise<Student[]> {
    try {
      return this.paymentService.getAllDeclinedPayments(page);
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

  @Get('declined/:id')
  async getEventDeclinedPayments(
    @Param('id', ParseIntPipe) eventId: number,
    @Query('page') page: number,
  ): Promise<Student[]> {
    try {
      return await this.paymentService.getEventDeclinedPayments(eventId, page);
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Get('pending')
  async getAllPendingPayments(@Query('page') page: number): Promise<Student[]> {
    try {
      return this.paymentService.getAllPendingPayments(page);
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

  @Get('pending/:id')
  async getEventPendingPayments(
    @Param('id', ParseIntPipe) eventId: number,
    @Query('page') page: number,
  ) {
    try {
      return await this.paymentService.getEventPendingPayments(eventId, page);
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }
}
