import fs from 'fs';
import path from 'path';

const localEnvPath = path.join(process.cwd(), '.env');
const localEnv = `MASTODON_INSTANCE=myInstance
MASTODON_ACCESS_TOKEN=myToken
RSSFEED_URL=myfeed.com
POLLING_INTERVAL=60
STATE_PATH=state
`;

if (!fs.existsSync(localEnvPath)) {
  fs.writeFileSync(localEnvPath, localEnv, { encoding: 'utf8' });
}
