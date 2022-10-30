import { IgApiClient } from 'instagram-private-api';
import axios from 'axios';

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const verifyRecaptcha = async (token) => {
  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  return axios.post(verificationUrl);
};

async function Index(req, res) {
  const { token, username } = req.body;

  try {
    // Recaptcha response
    const response = await verifyRecaptcha(token);

    if (response.data.success && response.data.score >= 0.5) {
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
        return res.status(200).json({ url });
      });
    }
    return res.status(400).json({
      status: 'Failed',
      message: 'Something went wrong, please try again!!!',
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: 'Something went wrong, please try again!!!',
    });
  }
}

export default Index;
