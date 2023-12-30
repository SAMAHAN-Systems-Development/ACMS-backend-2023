import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Patch('/activate/:id')
  async activateEvent(@Param('id') eventId: number) {
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
  async inactivateEvent(@Param('id') eventId: number) {
    try {
      return await this.eventService.inactivateEvent(eventId);
    } catch (error) {
      throw new HttpException(
        'Unable to inactivate event.',
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }
}
