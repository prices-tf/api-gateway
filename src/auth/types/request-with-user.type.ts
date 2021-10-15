import { FastifyRequest } from 'fastify';
import { AuthUser } from '../interfaces/auth-user.interface';

export type RequestWithUser = FastifyRequest & {
  user: AuthUser;
};
