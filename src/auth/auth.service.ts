import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { UserService } from '../users/user.service';
import { LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService, private readonly userService: UserService) {}

  async login(loginDto: LoginDto) {
    const {email, password} = loginDto

    // Ensure that both email and password are provided
    if (!email || !password) {
      return { error: 'Email and password are required.' };
    }

    const { data, error } = await this.supabaseService
      .getSupabase()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      // Handle login error
      return { error };
    }

    // Access user information from the session
    const userInfo = data?.user;

    // Retrieve userType based on supabaseUserId
    const userType = await this.userService.getUserTypeBySupabaseUserId(userInfo?.id);

    // Return user information
    return { email: userInfo.email, userType };
  }
}