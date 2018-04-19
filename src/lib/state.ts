import fs from 'fs';
import path from 'path';
import { Toot } from '../interfaces/Toot';

const statePath = path.join(process.cwd(), 'state');

export const getState = () => {
  return fs.existsSync(statePath)
    ? Number(fs.readFileSync(statePath, { encoding: 'utf8' }))
    : 0;
};

export const setState = (toots: Toot[]) => {
  fs.writeFileSync(
    statePath,
    new Date((toots as any).shift().articleDate).getTime(),
  );
};
