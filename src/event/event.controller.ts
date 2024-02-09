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
import { Roles } from 'src/auth/roles.decorator';

@Controller('event')
@UseGuards(AuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get(':id')
  @Roles('admin')
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
  @Roles('admin')
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
  @Roles('admin')
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
  @Roles('admin', 'facilitator')
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

  @Put(':id')
  @Roles('admin')
  async editEvents(
    @Param('id') id: number,
    @Body() UpdateEventDto: AddEventDto,
  ) {
    const EditedEvent = await this.eventService.editEvents(id, UpdateEventDto);
    return { message: 'Event added successfully', data: EditedEvent };
  }

  @Post('')
  @Roles('admin')
  async addEvents(@Body() AddEventDto: AddEventDto) {
    const AddedEvent = await this.eventService.addEvent(AddEventDto);
    return { message: 'Event added successfully', data: AddedEvent };
  }

  @Get('inactive')
  @Roles('admin')
  async getInactiveEvents(@Query('page') page: number): Promise<Event[]> {
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
}
