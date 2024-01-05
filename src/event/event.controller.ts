import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get(':id')
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
}
