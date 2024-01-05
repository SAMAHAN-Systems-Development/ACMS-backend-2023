import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('login') // Use '/login' as the endpoint
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post() // Use POST method for handling login
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);

    return result;
  }
}