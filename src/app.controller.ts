import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guards';

@UseGuards(AuthGuard) // Assuming you have an AuthGuard defined in your application
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  someProtectionRoute(@Req() req) {
    return { message: 'This is a protected route', userId: req.userId };
  }
}
// This route is protected by the AuthGuard, which checks for a valid JWT token
