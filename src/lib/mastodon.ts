import { Toot } from '../interfaces/Toot';

const Mastodon = require('mastodon-api');

const masto = new Mastodon({
  access_token: process.env.MASTODON_ACCESS_TOKEN,
  api_url: `${process.env.MASTODON_INSTANCE}/api/v1/`,
});

export const sendToots = (toots: Toot[]): Promise<Toot[]> => {
  return Promise.all(
    toots.map(({ articleDate, ...toot }) =>
      masto.post('statuses', toot).then(data => ({ ...toot, articleDate })),
    ),
  );
};
