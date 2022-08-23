import { IgApiClient } from 'instagram-private-api';
import { existsSync, chmod, writeFile, readFile } from 'fs';
import getConfig from 'next/config';
import path from 'path';

const SESSION_FILE_PATH = `${path.join(getConfig().publicRuntimeConfig.staticFolder, 'session.json')}`;

chmod(SESSION_FILE_PATH, 777);

function fakeSave(data) {
  // write file
  writeFile(SESSION_FILE_PATH, JSON.stringify(data), (err) => {
    if (err) throw err;
  });
}

function fakeExists() {
  return existsSync(SESSION_FILE_PATH);
}

function fakeLoad() {
  const datas = readFile(SESSION_FILE_PATH, 'utf8', (err, data) => {
    if (err) throw err;
    return data;
  });
  return JSON.parse(datas);
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function Index(req, res) {
  const { username } = req.query;

  await sleep(2500).then(async () => {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.NEXT_PUBLIC_IG_USERNAME);
    ig.request.end$.subscribe(async () => {
      const serialized = await ig.state.serialize();
      delete serialized.constants;
      fakeSave(serialized);
    });
    if (fakeExists()) {
      try {
        await ig.state.deserialize(fakeLoad());
        await ig.user.info(ig.state.cookieUserId);
      } catch (e) {
        await ig.qe.syncLoginExperiments();
        await ig.account.login(process.env.NEXT_PUBLIC_IG_USERNAME, process.env.NEXT_PUBLIC_IG_PASSWORD);
      }
    }

    const { url } = (await ig.user.info(await ig.user.getIdByUsername(username))).hd_profile_pic_url_info;
    res.status(200).json({ url });
  });
}

export default Index;
