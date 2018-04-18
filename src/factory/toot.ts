import * as html2text from 'html-to-text';
import R from 'ramda';

import { Article } from '../interfaces/Article';
import { Toot } from '../interfaces/Toot';
import { getState } from '../lib/state';

const formatContent = (article: Article) => {
  const splittedContent = html2text
    .fromString(R.dropLast(1, article.content))
    .split('\n');
  const footer = splittedContent.pop();

  return (
    article.title +
    '\n' +
    splittedContent.join('\n').substr(0, 250) +
    '...\n\n' +
    footer
  );
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
      status: formatContent(article),
      visibility: 'public',
    }));
};
