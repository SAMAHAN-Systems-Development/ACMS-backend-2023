import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { SupabaseService } from 'supabase/supabase.service';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Controller()
export class UsersController {
  constructor(
    private readonly prismaService: UserService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Post('register')
  async registerUser(@Body() userData: UserDto) {
    try {

      // Step 2: Create user in Prisma
      const prismaUser = await this.prismaService.createUser({
        email: userData.email,
        password: userData.password,
        userType: userData.userType,
      
      });
      
      // Return successful response
      return prismaUser;

    } catch (error) {
      console.error('User registration error:', error);
      return { error: 'User registration failed.' };
    }
  }
}
