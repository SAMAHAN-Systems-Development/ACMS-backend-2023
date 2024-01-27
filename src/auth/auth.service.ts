import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { LoginDto } from './auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response as Res } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, res: Res) {
    const { supabaseUserId } = loginDto;

    const { email, userType } = await this.getUserInfoBySupabaseUserId(
      supabaseUserId,
    );
    const payload = { username: email, supabaseUserId: supabaseUserId };
    const accessToken = this.jwtService.sign(payload);

    const returnValue = res
      .set({
        'x-access-token': accessToken,
        'Access-Control-Expose-Headers': 'x-access-token',
      })
      .json({ email, userType });
    return returnValue;
  }

  async getUserInfoBySupabaseUserId(
    supabaseUserId: string,
  ): Promise<{ email: string; userType: string }> {
    const user = await this.prismaService.user.findUnique({
      where: {
        supabaseUserId: supabaseUserId,
      },
      select: {
        email: true,
        userType: true,
      },
    });

    return user;
  }
}
