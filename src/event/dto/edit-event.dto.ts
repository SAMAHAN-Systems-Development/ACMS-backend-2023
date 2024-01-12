import { PartialType } from '@nestjs/mapped-types';
import { AddEventDto } from './add-event.dto';

export class EditEventsDto extends PartialType(AddEventDto) {}
