import { PartialType } from '@nestjs/mapped-types';
import { CreateEventTierDto } from './create-event-tier.dto';

export class UpdateEventTierDto extends PartialType(CreateEventTierDto) {}
