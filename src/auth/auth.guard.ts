import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    const environment = process.env.NODE_ENV || 'development';

    const allowedRoles = this.reflector.get<string[]>(
      'allowedRoles',
      context.getHandler(),
    ) ?? ['any'];

    try {
      const { email, role } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request.user = { email: email, role: role };

      // if 'any' is in allowedRoles,
      // anyone authenticated can access
      if (allowedRoles.includes('any')) {
        return true;
      }

      if (allowedRoles.includes(role)) {
        return true;
      }
    } catch {
      request.user = { role: 'guest' };
    }

    if (
      environment === 'development' ||
      allowedRoles.includes('guest') // only guest
    ) {
      return true;
    }

    throw new UnauthorizedException();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
