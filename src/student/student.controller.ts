import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.studentService.findAll();
  }
  @Post('submit-registration')
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.createStudent(createStudentDto);
  }

  @Get(':uuid')
  async getStudentByUuid(@Param('uuid') uuid: string) {
    return this.studentService.getStudentByUuid(uuid);
  }

  @Get(':uuid/:eventId')
  @UseGuards(AuthGuard)
  async getStudentByUuidAndEventId(
    @Param('uuid') uuid: string,
    @Param('eventId') eventId: number,
    @Query('isForScanning') isForScanning: boolean,
  ) {
    isForScanning = isForScanning || false;
    return this.studentService.getStudentByUuidAndEventId(
      uuid,
      Number(eventId),
      Boolean(isForScanning),
    );
  }
}
