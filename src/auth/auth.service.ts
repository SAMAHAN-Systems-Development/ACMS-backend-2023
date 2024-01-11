import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'supabase/supabase.service';
import { LoginDto } from './auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response as Res } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, res: Res) {
    const { email, password } = loginDto;

    if (!email || !password) {
      throw new UnauthorizedException();
    }

    const { data, error } = await this.supabaseService
      .getSupabase()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw new UnauthorizedException();
    }
    const userInfo = data?.user;
    const userType = await this.getUserTypeBySupabaseUserId(userInfo?.id);
    const payload = { username: email };
    const accessToken = this.jwtService.sign(payload);

    const returnValue = res
      .set({ 'x-access-token': accessToken })
      .json({ email: userInfo.email, userType });

    return returnValue;
  }

  async getUserTypeBySupabaseUserId(
    supabaseId: string,
  ): Promise<string | null> {
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
