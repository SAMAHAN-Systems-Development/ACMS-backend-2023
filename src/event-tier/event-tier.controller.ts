import { Controller, Get, UseGuards } from '@nestjs/common';
import { EventTierService } from './event-tier.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('event-tier')
export class EventTierController {
  constructor(private readonly eventTierService: EventTierService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.eventTierService.findAll();
  }

  @Get(':eventId')
  @UseGuards(AuthGuard)
  getEventTiersBasedOnEventId(eventId: number) {
    return this.eventTierService.getEventTiersBasedOnEventId(eventId);
  }
}
