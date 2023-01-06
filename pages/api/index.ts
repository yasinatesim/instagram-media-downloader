import { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
import Bluebird from 'bluebird';
import inquirer from 'inquirer';
import { IgApiClient, IgCheckpointError } from 'instagram-private-api';

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const verifyRecaptcha = async (token: string) => {
  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  return axios.post(verificationUrl);
};

async function Index(req: NextApiRequest, res: NextApiResponse) {
  const { token, username } = req.body;

  try {
    // Recaptcha response
    const response = await verifyRecaptcha(token);

    if (response.data.success && response.data.score >= 0.5) {
    return sleep(2500).then(() => {
      const ig = new IgApiClient();

      ig.state.deviceString = process.env.NEXT_PUBLIC_IG_DEVICE_STRING as string;
      ig.state.deviceId = process.env.NEXT_PUBLIC_IG_DEVICE_ID as string;
      ig.state.uuid = process.env.NEXT_PUBLIC_IG_UUID as string;
      ig.state.phoneId = process.env.NEXT_PUBLIC_IG_PHONE_ID as string;
      ig.state.adid = process.env.NEXT_PUBLIC_IG_ADID as string;
      ig.state.build = process.env.NEXT_PUBLIC_IG_BUILD as string;

      return Bluebird.try(async () => {
        const auth = await ig.account.login(
          process.env.NEXT_PUBLIC_IG_USERNAME as string,
          process.env.NEXT_PUBLIC_IG_PASSWORD as string
        );
        if (auth) {
          const { url } = (await ig.user.info(await ig.user.getIdByUsername(username))).hd_profile_pic_url_info;
          return res.status(200).json({ url });
        }
      })
        .catch(IgCheckpointError, async () => {
          await ig.challenge.auto(true); // Requesting sms-code or click "It was me" button
          console.log(ig.state.checkpoint); // Challenge info here
          const { code } = await inquirer.prompt([
            {
              type: 'input',
              name: 'code',
              message: 'Enter code',
            },
          ]);
          console.log(await ig.challenge.sendSecurityCode(code));
        })
        .catch((e) => console.log('Could not resolve checkpoint:', e, e.stack));
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
