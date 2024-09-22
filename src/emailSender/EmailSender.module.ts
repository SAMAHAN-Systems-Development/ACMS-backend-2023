import { Module } from '@nestjs/common';
import { EmailSender } from './EmailSender';
import { StarSearchEmailSender } from './StarSearchEmailSender';

@Module({
  exports: [EmailSender, StarSearchEmailSender],
  providers: [EmailSender, StarSearchEmailSender],
})
export class EmailSenderModule {}
