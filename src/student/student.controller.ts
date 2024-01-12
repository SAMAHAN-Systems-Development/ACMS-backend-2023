import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ReadStudentDto } from './dto/read-student.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  // @UseGuards(AuthGuard)
  findAll() {
    return this.studentService.findAll();
  }

  @Put(':id')
  // @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }

  @Get(':uuid')
  // @UseGuards(AuthGuard)
  async getStudentByUuid(@Param('uuid') uuid: string): Promise<ReadStudentDto> {
    return this.studentService.getStudentByUuid(uuid);
  }
}
