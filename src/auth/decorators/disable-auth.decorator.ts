import { SetMetadata } from '@nestjs/common';
import * as constants from '../constants/disable-auth.constant';

export const DisableAuth = (type?: 'JWT') =>
  SetMetadata(
    type !== undefined
      ? constants['DISABLE_' + type + '_AUTH_KEY']
      : constants.DISABLE_AUTH_KEY,
    true,
  );
