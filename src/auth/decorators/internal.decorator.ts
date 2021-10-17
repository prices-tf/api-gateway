import { SetMetadata } from '@nestjs/common';
import { INTERNAL_KEY } from '../constants/internal.constant';

export const InternalOnly = (internalOnly = true) =>
  SetMetadata(INTERNAL_KEY, internalOnly);
