import dotenv from 'dotenv';
import R from 'ramda';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { interval } from 'rxjs/observable/interval';
import { catchError, filter, map, merge, switchMap, tap } from 'rxjs/operators';

dotenv.config();

import { tootsFactory } from './factory/toot';
import { Toot } from './interfaces/Toot';
import { getFeed } from './lib/feed';
import logger from './lib/logger';
import { sendToots } from './lib/mastodon';
import { setState } from './lib/state';

const doTheBotJob = () => {
  return fromPromise(getFeed(process.env.RSSFEED_URL)).pipe(
    map(tootsFactory),
    filter(toots => !R.isEmpty(toots)),
    switchMap(sendToots),
    tap((toots: Toot[]) => setState((toots as any).shift().articleDate)),
    tap((toots: Toot[]) =>
      logger.info(
        `${toots.length} toots submitted to ${process.env.MASTODON_INSTANCE}`,
      ),
    ),
    catchError(err => Promise.resolve(logger.error(err))),
  );
};

doTheBotJob()
  .pipe(
    merge(
      interval(Number(process.env.POLLING_INTERVAL) * 60 * 1000).pipe(
        switchMap(doTheBotJob),
      ),
    ),
  )
  .subscribe();
