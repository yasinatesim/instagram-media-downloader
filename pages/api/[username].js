const { IgApiClient } = require('instagram-private-api');
const ig = new IgApiClient();

async function login() {
  ig.state.generateDevice(process.env.NEXT_PUBLIC_IG_USERNAME);
  await ig.account.login(process.env.NEXT_PUBLIC_IG_USERNAME, process.env.NEXT_PUBLIC_IG_PASSWORD);
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function Index(req, res) {
  const { username } = req.query

  await sleep(2500).then(async () => {
    await login();

    const url = (await ig.user.info(await ig.user.getIdByUsername(username))).hd_profile_pic_url_info.url;
    res.status(200).json({ url });
  })
}

export default Index;
