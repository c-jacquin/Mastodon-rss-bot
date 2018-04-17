import dotenv from 'dotenv';
import R from 'ramda';
import { interval } from 'rxjs/observable/interval';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

dotenv.config();

import { tootsFactory } from './factory/toot';
import { getFeed } from './lib/feed';
import logger from './lib/logger';
import { sendToots } from './lib/mastodon';
import { setState } from './lib/state';

interval(Number(process.env.POLLING_INTERVAL) * 60 * 1000)
  .pipe(
    switchMap(() => getFeed(process.env.RSSFEED_URL)),
    map(tootsFactory),
    filter(toots => !R.isEmpty(toots)),
    switchMap(sendToots),
    tap(toots => setState(toots.pop().articleDate)),
    catchError(err => Promise.resolve(logger.error(err))),
  )
  .subscribe();
