import { PartialType } from '@nestjs/mapped-types';
import { AddEventDto } from './add-events.dto';

export class EditEventsDto extends PartialType(AddEventDto) {}
