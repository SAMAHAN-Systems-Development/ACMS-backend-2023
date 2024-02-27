import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ReadStudentDto } from './dto/read-student.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    console.log('find all executed');
    return this.studentService.findAll();
  }
  @Post('submit-registration')
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.createStudent(createStudentDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }

  @Get(':uuid')
  @UseGuards(AuthGuard)
  async getStudentByUuid(@Param('uuid') uuid: string): Promise<ReadStudentDto> {
    return this.studentService.getStudentByUuid(uuid);
  }

  @Get(':uuid/:eventId')
  @UseGuards(AuthGuard)
  async getStudentByUuidAndEventId(
    @Param('uuid') uuid: string,
    @Param('eventId') eventId: number,
  ): Promise<ReadStudentDto> {
    return this.studentService.getStudentByUuidAndEventId(
      uuid,
      Number(eventId),
    );
  }
}
