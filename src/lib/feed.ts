import fetch from 'node-fetch';

export const getFeed = async () => {
  const response = await fetch(process.env.RSSFEED_URL as string);

  return response.json();
};
