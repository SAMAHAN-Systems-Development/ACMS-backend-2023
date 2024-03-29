import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from 'supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { EventModule } from './event/event.module';
import { EventTierModule } from './event-tier/event-tier.module';

@Module({
  imports: [
    PrismaModule,
    StudentModule,
    PaymentModule,
    EventModule,
    SupabaseModule,
    AuthModule,
    EventTierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
