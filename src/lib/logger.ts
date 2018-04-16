import bunyan from 'bunyan';
import path from 'path';

import pkg from '../../package.json';
import { isProduction } from './env';

export default bunyan.createLogger({
  name: pkg.name,
  streams: isProduction()
    ? [
        {
          level: 'info',
          stream: process.stdout,
        },
        {
          level: 'error',
          path: path.join(process.cwd(), 'log/error.log'),
        },
      ]
    : [
        {
          level: 'info',
          stream: process.stdout,
        },
      ],
});
