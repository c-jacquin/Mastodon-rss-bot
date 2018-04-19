import request from 'request';

import { Toot } from '../interfaces/Toot';

const Mastodon = require('mastodon-api');

const masto = new Mastodon({
  access_token: process.env.MASTODON_ACCESS_TOKEN,
  api_url: `${process.env.MASTODON_INSTANCE}/api/v1/`,
});

const onImageUploaded = (resp: any, toot: Toot): string => {
  delete toot.imageUrls;
  return resp.data.id;
};

export const sendToots = (toots: Toot[]): Promise<Toot[]> => {
  return Promise.all(
    toots.map(({ articleDate, ...toot }) =>
      masto.post('statuses', toot).then(data => ({ ...toot, articleDate })),
    ),
  );
};

export const uploadImages = (toots: Toot[]): Promise<Toot[]> => {
  return Promise.all(
    toots.map(async toot => ({
      ...toot,
      media_ids: await Promise.all(
        toot.imageUrls!.map(url =>
          masto
            .post('media', { file: request(url) })
            .then(resp => onImageUploaded(resp, toot)),
        ),
      ),
    })),
  );
};
