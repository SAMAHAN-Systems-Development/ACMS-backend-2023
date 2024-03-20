import {
  Controller,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Post,
  UseGuards,
  Put,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '@prisma/client';
import { AddEventDto } from './dto/add-event.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('active')
  @UseGuards(AuthGuard)
  async getActiveEvents(@Query('page') page: number) {
    try {
      return await this.eventService.getActiveEvents(page);
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

  @Get('inactive')
  @UseGuards(AuthGuard)
  async getInactiveEvents(@Query('page') page: number) {
    try {
      return await this.eventService.getInactiveEvents(page);
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

  @Get(':id')
  @UseGuards(AuthGuard)
  async viewEvent(@Param('id', ParseIntPipe) eventId: number) {
    try {
      return await this.eventService.viewEvent(eventId);
    } catch (error) {
      throw new HttpException('Unable to view event.', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Patch('/activate/:id')
  @UseGuards(AuthGuard)
  async activateEvent(@Param('id', ParseIntPipe) eventId: number) {
    try {
      return await this.eventService.activateEvent(eventId);
    } catch (error) {
      throw new HttpException(
        'Unable to activate event.',
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Patch('/inactivate/:id')
  @UseGuards(AuthGuard)
  async inactivateEvent(@Param('id', ParseIntPipe) eventId: number) {
    try {
      return await this.eventService.inactivateEvent(eventId);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Unable to inactivate event.',
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async editEvent(
    @Param('id') id: number,
    @Body() UpdateEventDto: AddEventDto,
  ) {
    await this.eventService.editEvent(Number(id), UpdateEventDto);
  }

  @Post()
  @UseGuards(AuthGuard)
  async addEvents(@Body() addEventDto: AddEventDto) {
    const AddedEvent = await this.eventService.addEvent(addEventDto);
    return { message: 'Event added successfully', data: AddedEvent };
  }

  @Get('/active/all/title')
  @UseGuards(AuthGuard)
  async getAllTitleOfActiveEvents() {
    try {
      return await this.eventService.getAllActiveEvents();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Unable to fetch all active events.',
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Get('/form-name/:formName')
  async getEventByFormName(@Param('formName') formName: string) {
    try {
      return await this.eventService.getEventByFormName(formName);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Unable to find the event.',
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }
}
