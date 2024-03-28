import { Controller, Post, Body, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { Response as Res } from 'express';

@Controller('user') // Use '/login' as the endpoint
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post() // Use POST method for handling login
  async login(@Body() loginDto: LoginDto, @Response() res: Res) {
    const result = await this.authService.login(loginDto, res);
    return result;
  }
}
