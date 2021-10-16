import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenModel {
  @ApiProperty({
    description: 'A JSON Web Token (JWT) used to authenticate with the APIs',
    type: 'string',
    format: 'password',
  })
  accessToken: 'string';
}
