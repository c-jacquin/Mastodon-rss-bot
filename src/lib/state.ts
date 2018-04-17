import fs from 'fs';
import path from 'path';

const statePath = path.join(process.cwd(), 'state');

export const getState = () => {
  return fs.existsSync(statePath)
    ? Number(fs.readFileSync(statePath, { encoding: 'utf8' }))
    : 0;
};

export const setState = (published: string) => {
  fs.writeFileSync(statePath, new Date(published).getTime());
};
