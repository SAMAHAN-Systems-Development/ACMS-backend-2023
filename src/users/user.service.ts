// src/users/user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { SupabaseService } from 'supabase/supabase.service';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService, private readonly supabaseService: SupabaseService,) {}

  async createUser(data: UserDto): Promise<User> {
    const { user, error } = await this.supabaseService.createSupabaseUser(
      data.email,  
      data.password,  
    );

    if (error) {
      // Handle Supabase signup error
      console.error('Supabase signup error:', error);
      throw error;

    }

    return await this.prismaService.user.create({  
      data: {  
        email: data.email,  
        userType: data.userType,  
        supabaseUserId: user.id,  
      },  
    });
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
