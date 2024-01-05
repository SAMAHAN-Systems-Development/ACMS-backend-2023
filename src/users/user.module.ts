import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { SupabaseService } from 'supabase/supabase.service';

@Module({
  controllers: [UsersController],
  providers: [UserService, SupabaseService],
})
export class UsersModule {}