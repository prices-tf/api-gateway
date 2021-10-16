import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config, Services } from '../common/config/configuration';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<Config>,
  ) {}

  generateAccessToken(): Promise<string> {
    const url = `${this.configService.get<Services>('services').jwk}/jwks/sign`;

    return this.httpService
      .post(url, {
        payload: {},
        issuedAt: new Date(),
        // Make access token expire after two minutes
        expiresAt: new Date(new Date().getTime() + 2 * 60 * 1000),
      })
      .toPromise()
      .then((response) => response.data.jwt);
  }
}
