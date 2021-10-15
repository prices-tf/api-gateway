import { Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('access')
  // No need to be authenticated to generate token
  // TODO: Authenticate using API key
  @Public()
  @HttpCode(200)
  getAccessToken(): Promise<{
    accessToken: string;
  }> {
    return this.authService.generateAccessToken().then((accessToken) => ({
      accessToken,
    }));
  }
}
