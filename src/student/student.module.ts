import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { SupabaseModule } from 'supabase/supabase.module';
import { EmailSenderModule } from 'src/emailSender/EmailSender.module';

@Module({
  imports: [SupabaseModule, EmailSenderModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
