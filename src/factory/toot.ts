import * as html2text from 'html-to-text';
import R from 'ramda';

import { Article } from '../interfaces/Article';
import { Toot } from '../interfaces/Toot';
import { getState } from '../lib/state';

const getContentLength = (title, footer) => {
  return Number(process.env.TOOT_LENGTH) - title.length - footer.length - 3;
};

const formatContent = (article: Article): string => {
  const splittedContent = html2text
    .fromString(R.dropLast(1, article.content))
    .split('\n');
  const footer = splittedContent.pop();

  return (
    article.title +
    '\n' +
    splittedContent
      .join('\n')
      .substr(0, getContentLength(article.title, footer)) +
    '...\n\n' +
    footer
  );
};

const extractImagesUrl = (article: Article): any[] => {
  const getUrls = require('get-urls');
  const isImage = require('is-image');
  return Array.from(getUrls(article.content))
    .filter(isImage)
    .slice(0, Number(process.env.PICTURE_PER_TOOT));
};

export const tootsFactory = (articles: Article[]): Toot[] => {
  const lastTootTimestamp = getState();
  return articles
    .filter(article => {
      const timestamp = new Date(article.published).getTime();
      return timestamp > lastTootTimestamp;
    })
    .map(article => ({
      articleDate: article.published,
      imageUrls: extractImagesUrl(article),
      status: formatContent(article),
      visibility: process.env.TOOT_VISIBILITY,
    }));
};
