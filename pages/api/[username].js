const { IgApiClient } = require('instagram-private-api');

const { writeFileSync, readFileSync } = require('fs');
const path = require('path');

const SESSION_FILE_PATH = path.resolve(path.join(process.cwd(), 'session.json'));

function fakeSave(data) {
  writeFileSync(SESSION_FILE_PATH, JSON.stringify(data), 'utf8');
  return data;
}

function fakeExists() {
  const data = readFileSync(SESSION_FILE_PATH, 'utf-8');
  if (data.length > 1) return true;
  return false;
}

function fakeLoad() {
  return readFileSync(SESSION_FILE_PATH);
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function Index(req, res) {
  const { username } = req.query;

  await sleep(2500).then(async () => {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.NEXT_PUBLIC_IG_USERNAME);
    await ig.qe.syncLoginExperiments();
    ig.request.end$.subscribe(async () => {
      const serialized = await ig.state.serialize();
      delete serialized.constants;
      fakeSave(serialized);
    });
    if (fakeExists()) {
      try {
        await ig.state.deserialize(fakeLoad(SESSION_FILE_PATH));
        await ig.user.info(ig.state.cookieUserId);
      } catch (e) {
        console.log(e, 'SESSION NOT VALID, DOING LOGIN');
      }
    }

    await ig.account.login(process.env.NEXT_PUBLIC_IG_USERNAME, process.env.NEXT_PUBLIC_IG_PASSWORD);

    const { url } = (await ig.user.info(await ig.user.getIdByUsername(username))).hd_profile_pic_url_info;
    res.status(200).json({ url });
  });
}

export default Index;
