import { Module } from '@nestjs/common';
import { EventTierService } from './event-tier.service';
import { EventTierController } from './event-tier.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventTierController],
  providers: [EventTierService],
})
export class EventTierModule {}
