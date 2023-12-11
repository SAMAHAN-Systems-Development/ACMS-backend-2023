import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, StudentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
