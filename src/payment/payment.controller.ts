import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Student } from '@prisma/client';
import { AcceptPaymentDto } from './dto/accept-payment.dto';
import { DeclinePaymentDto } from './dto/decline-payment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('payment')
@UseGuards(AuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('accept')
  @Roles('admin')
  async acceptPayments(
    @Body() acceptPaymentDto: AcceptPaymentDto,
  ): Promise<Student[]> {
    try {
      return await this.paymentService.acceptPayments(
        acceptPaymentDto.paymentIds,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          'Something went wrong',
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          },
        );
      }
    }
  }

  @Post('decline')
  @Roles('admin')
  async declinePayments(
    @Body() declinePaymentDto: DeclinePaymentDto,
  ): Promise<Student[]> {
    try {
      return await this.paymentService.declinePayments(
        declinePaymentDto.paymentIds,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          'Something went wrong',
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          },
        );
      }
    }
  }

  @Get('accepted')
  @Roles('admin')
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
  @Roles('admin')
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
  @Roles('admin')
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
  @Roles('admin')
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
  @Roles('admin')
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
  @Roles('admin')
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
