import { IgApiClient } from 'instagram-private-api';

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function Index(req, res) {
  const { username } = req.query;

  await sleep(2500).then(async () => {
    const ig = new IgApiClient();
    ig.state.deviceString = process.env.NEXT_PUBLIC_IG_DEVICE_STRING;
    ig.state.deviceId = process.env.NEXT_PUBLIC_IG_DEVICE_ID;
    ig.state.uuid = process.env.NEXT_PUBLIC_IG_UUID;
    ig.state.phoneId = process.env.NEXT_PUBLIC_IG_PHONE_ID;
    ig.state.adid = process.env.NEXT_PUBLIC_IG_ADID;
    ig.state.build = process.env.NEXT_PUBLIC_IG_BUILD;

    await ig.account.login(process.env.NEXT_PUBLIC_IG_USERNAME, process.env.NEXT_PUBLIC_IG_PASSWORD);

    const { url } = (await ig.user.info(await ig.user.getIdByUsername(username))).hd_profile_pic_url_info;
    res.status(200).json({ url });
  });
}

export default Index;
