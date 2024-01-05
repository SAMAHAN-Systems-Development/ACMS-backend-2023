import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from 'supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { PaymentModule } from './payment/payment.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [PrismaModule, StudentModule, PaymentModule, EventModule, SupabaseModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
