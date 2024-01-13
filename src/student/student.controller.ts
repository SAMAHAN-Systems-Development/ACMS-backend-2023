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
  Request,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ReadStudentDto } from './dto/read-student.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('student')
@UseGuards(AuthGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @Roles('admin')
  findAll() {
    console.log('find all executed');
    return this.studentService.findAll();
  }

  @Post('submit-registration')
  @Roles('guest', 'cashier')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Request() req,
    @Body() createStudentDto: CreateStudentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.studentService.createStudent(req, createStudentDto, file);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }

  @Get(':uuid')
  @Roles('admin', 'facilitator')
  async getStudentByUuid(@Param('uuid') uuid: string): Promise<ReadStudentDto> {
    return this.studentService.getStudentByUuid(uuid);
  }
}
