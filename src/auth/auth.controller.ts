import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //TODO: Post SignUp
  @Post('signup')
  //auth/signup'
  async signUp(@Body() SignUpData: SignUpDto) {
    return this.authService.signup(SignUpData);

    // Implement sign-up logic here
  }
  //TODO: Post Login
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
    // Implement login logic here
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    //TODO: Refresh Token
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
    // Implement refresh token logic here
  }
}
