import { Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AccessTokenModel } from './models/access-token.model';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('access')
  @ApiOperation({
    summary: 'Request short-lived access token used to authenticate',
    description:
      'Request access token used to authenticate when using APIs and websocket server. The JWT is signed by a private key. The private keys are rotated automatically to improve security. The access token expires after a few minutes, so you will need to request a new access token when the token expires to be able to continue using the APIs.',
  })
  @ApiOkResponse({
    status: 200,
    type: AccessTokenModel,
  })
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
