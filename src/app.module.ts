import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [PrismaModule, StudentModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
