import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SupabaseModule } from 'supabase/supabase.module';
import { UserService } from '../users/user.service'; 
import { AuthService } from './auth.service'; 

@Module({
  imports: [SupabaseModule],
  controllers: [AuthController],
  providers: [UserService, AuthService],
})
export class AuthModule {}