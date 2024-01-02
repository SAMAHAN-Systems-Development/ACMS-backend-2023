import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { v4 as uuidv4 } from 'uuid';
import { Payment } from '@prisma/client';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  /*@Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }*/

  @Get()
  findAll() {
    console.log('find all executed');
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Post('submit-registration')
  create(@Body() createStudentDto: CreateStudentDto) {
    createStudentDto.uuid = uuidv4();
    return this.studentService.createStudent(createStudentDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
