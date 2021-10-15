import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
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

  await app.register(fastifyHelmet);

  app.enableShutdownHooks();

  await app.listen(configService.get<number>('port'));
}
bootstrap();
