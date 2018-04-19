import fs from 'fs';
import path from 'path';

const localEnvPath = path.join(process.cwd(), '.env');
const localEnv = `RSSFEED_URL=myfeed.com
POLLING_INTERVAL=60
MASTODON_INSTANCE=myInstance
MASTODON_ACCESS_TOKEN=myToken
PICTURE_PER_TOOT=1
TOOT_VISIBILITY=public
STATE_PATH=state
`;

if (!fs.existsSync(localEnvPath)) {
  fs.writeFileSync(localEnvPath, localEnv, { encoding: 'utf8' });
}
