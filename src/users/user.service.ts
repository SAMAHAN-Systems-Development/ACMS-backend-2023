// src/users/user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Users } from '@prisma/client';
import { SupabaseService } from 'supabase/supabase.service';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService, private readonly supabaseService: SupabaseService,) {}

  async createUser(data: UserDto): Promise<Users> {
    const { user, error } = await this.supabaseService.createSupabaseUser(
      data.email,  
      data.password,  
    );

    if (error) {
      // Handle Supabase signup error
      console.error('Supabase signup error:', error);
      throw error;

    }

    const prismaData: Prisma.UsersCreateInput = {
      email: data.email,
      userType: data.userType,
      supabaseUserId: user.id
    };
    

    return this.prismaService.users.create({
      data: prismaData,
    });
  }

  async getUserTypeBySupabaseUserId(supabaseId: string): Promise<string | null> {
    const user = await this.prismaService.users.findUnique({
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

