import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { LoginDto } from './auth.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService, private readonly prismaService: PrismaService) {}

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
    const userType = await this.getUserTypeBySupabaseUserId(userInfo?.id);

    // Return user information
    return { email: userInfo.email, userType };
  }

  async getUserTypeBySupabaseUserId(supabaseId: string): Promise<string | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        supabaseUserId: supabaseId, 
      },
      select: {
        userType: true,
      },
    });

    return user?.userType || null;
  }
}