import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { SupabaseModule } from 'supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
