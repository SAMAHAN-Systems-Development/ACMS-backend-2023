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
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';

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
  @Get('getBuckets')
  getBuckets() {
    console.log('test endpoint');
    return this.studentService.getBuckets();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  // added Multer type for better type safety when
  // uploading file
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.studentService.uploadImage(file);
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
