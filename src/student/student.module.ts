import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
