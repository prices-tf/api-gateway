import { Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('access')
  @HttpCode(200)
  getAccessToken(): Promise<{
    accessToken: string;
  }> {
    return this.authService.generateAccessToken().then((accessToken) => ({
      accessToken,
    }));
  }
}
