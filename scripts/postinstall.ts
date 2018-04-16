import fs from 'fs';
import path from 'path';

const localEnvPath = path.join(process.cwd(), '.env');
const localEnv = `MASTODON_INSTANCE=myInstance
RSSFEED_URL=myfeed.com
POLLING_INTERVAL=60
`;

if (!fs.existsSync(localEnvPath)) {
  fs.writeFileSync(localEnvPath, localEnv, { encoding: 'utf8' });
}
