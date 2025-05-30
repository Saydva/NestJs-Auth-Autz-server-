import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('token invalid'); // No token provided
    }
    try {
      const payload = this.jwtService.verify(token);
      request.userId = payload.userId; // Attach user information to the request
    } catch (error) {
      console.log('error', error.message);
      throw new UnauthorizedException('token invalid'); // Token verification failed
    }

    return true; // Implement your authentication logic here
  }
  private extractTokenFromHeader(request: Request): string | null {
    return request.headers.authorization?.split(' ')[1] || null;
  }
}
