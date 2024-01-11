import { Module } from '@nestjs/common';
import { EmailSender } from './EmailSender';

@Module({
  exports: [EmailSender],
  providers: [EmailSender],
})
export class EmailSenderModule {}
