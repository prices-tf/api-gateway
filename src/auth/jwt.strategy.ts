import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { Config, Services } from '../common/config/configuration';
import { FastifyRequest } from 'fastify';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { AuthUser } from './interfaces/auth-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly JWKS = jwksClient({
    jwksUri: this.configService.get<Services>('services').jwk + '/jwks',
  });

  constructor(private readonly configService: ConfigService<Config>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (
        req: FastifyRequest,
        token: string,
        done: (err: Error | null, key?: string) => void,
      ) => {
        const decoded = jwt.decode(token, {
          complete: true,
        });

        if (decoded === null || !decoded.header.kid) {
          done(new Error('Invalid token'));
          return;
        }

        this.JWKS.getSigningKey(decoded.header.kid)
          .then((publicKey) => {
            done(null, publicKey.getPublicKey());
          })
          .catch((err) => {
            done(err);
          });
      },
    });
  }

  async validate(payload: JWTPayload): Promise<AuthUser> {
    return payload;
  }
}
