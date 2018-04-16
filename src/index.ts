import dotenv from 'dotenv';
import { interval } from 'rxjs/observable/interval';
import { catchError, switchMap } from 'rxjs/operators';

import { getFeed } from './lib/feed';
import logger from './lib/logger';

dotenv.config();

interval(Number(process.env.POLLING_INTERVAL) * 60 * 1000).pipe(
  switchMap(getFeed),
  catchError(err => Promise.resolve(logger.error(err))),
);
