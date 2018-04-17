import { promisify } from 'util';

export const getFeed = promisify(require('feed-read-parser'));
