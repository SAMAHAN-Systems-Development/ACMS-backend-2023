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
} from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '@prisma/client';
import { AddEventDto } from './dto/add-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // @Get(':id')
  // async viewEvent(@Param('id', ParseIntPipe) eventId: number) {
  //   try {
  //     return await this.eventService.viewEvent(eventId);
  //   } catch (error) {
  //     throw new HttpException('Unable to view event.', HttpStatus.BAD_REQUEST, {
  //       cause: error,
  //     });
  //   }
  // }

  @Patch('/activate/:id')
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

  @Get('active')
  async getActiveEvents(@Query('page') page: number): Promise<Event[]> {
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

  @Post('')
  async addEvents(@Body() AddEventDto: AddEventDto){
    console.log(AddEventDto)
    const AddedEvent = await this.eventService.addEvent(AddEventDto);
    return { message: 'Event added successfully', data: AddedEvent };

  }


  

}