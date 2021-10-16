import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyServerOptions } from 'fastify';
import { fastifyHelmet } from 'fastify-helmet';
import { AppModule } from './app.module';
import { Config } from './common/config/configuration';

async function bootstrap() {
  const adapterOptions: FastifyServerOptions = {
    ignoreTrailingSlash: true,
    rewriteUrl: (req) => {
      // Semicolons in the url need to be parsed
      // https://github.com/fastify/fastify/issues/2487
      return req.url.replace(/;/g, '%3B');
    },
    trustProxy: process.env.NODE_ENV === 'production',
  };

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(adapterOptions),
  );
  const configService: ConfigService<Config> = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Prices.tf API documentation')
    .setDescription(
      'Documentation for Prices.tf public APIs. All APIs are protected by JWT authentication. The JWT is added to the authorization header on every request as a bearer token (see Auth section to generate access token).',
    )
    .setVersion('current')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Create JWT from access token API and enter it here',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });

  app.enableShutdownHooks();

  await app.listen(configService.get<number>('port'));
}
bootstrap();
