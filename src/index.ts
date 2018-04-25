import dotenv from 'dotenv';
import R from 'ramda';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { interval } from 'rxjs/observable/interval';
import { filter, map, merge, switchMap, tap } from 'rxjs/operators';

dotenv.config();

import { tootsFactory } from './factory/toot';
import { Toot } from './interfaces/Toot';
import { getFeed } from './lib/feed';
import logger from './lib/logger';
import { sendToots, uploadImages } from './lib/mastodon';
import { setState } from './lib/state';

const onSuccess = (toots: Toot[]) =>
  logger.info(
    `${toots.length} toots submitted to ${process.env.MASTODON_INSTANCE}`,
  );

const onError = err => Promise.resolve(logger.error(err));

const doTheBotJob = (): Observable<Toot[]> => {
  return fromPromise(getFeed(process.env.RSSFEED_URL)).pipe(
    map(tootsFactory),
    filter(toots => !R.isEmpty(toots)),
    map(toots => toots.slice(0, 1)),
    switchMap(uploadImages),
    switchMap(sendToots),
    tap(setState),
  );
};

const redoTheJobAgainAndAgain$ = interval(
  Number(process.env.POLLING_INTERVAL) * 60 * 1000,
).pipe(switchMap(doTheBotJob));

doTheBotJob()
  .pipe(merge(redoTheJobAgainAndAgain$))
  .subscribe(onSuccess, onError);
