import { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
import { IgApiClient, IgLoginRequiredError } from 'instagram-private-api';

import db from '@/configs/db';

type ErrorResponse = {
  status: string;
  message: string;
};

const verifyRecaptcha = async (token: string) => {
  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  return axios.post(verificationUrl);
};

async function fakeSave(data: object) {
  try {
    const options = { ignoreUndefinedProperties: true } as any;
    await db.collection('data').doc('session').set(data, options);
  } catch (error) {
    console.log(error);
  }
}

async function fakeExists() {
  try {
    const doc = await db.collection('data').doc('session').get();
    return doc.exists;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function fakeLoad() {
  try {
    const doc = await db.collection('data').doc('session').get();
    if (doc.exists) {
      return doc.data();
    }
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
}

async function fakeDelete() {
  try {
    await db.collection('data').doc('session').delete();
  } catch (error) {
    console.log(error);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function Index(req: NextApiRequest, res: NextApiResponse<ErrorResponse | { url: string }>) {
  const { token, username } = req.body;

  return await sleep(5000).then(async () => {
    try {
      // Recaptcha response
      const response = await verifyRecaptcha(token);

      if (response.data.success && response.data.score >= 0.5) {
        const ig = new IgApiClient();

        ig.state.deviceString = process.env.NEXT_PUBLIC_IG_DEVICE_STRING as string;
        ig.state.deviceId = process.env.NEXT_PUBLIC_IG_DEVICE_ID as string;
        ig.state.uuid = process.env.NEXT_PUBLIC_IG_UUID as string;
        ig.state.phoneId = process.env.NEXT_PUBLIC_IG_PHONE_ID as string;
        ig.state.adid = process.env.NEXT_PUBLIC_IG_ADID as string;
        ig.state.build = process.env.NEXT_PUBLIC_IG_BUILD as string;

        if (await fakeExists()) {
          await ig.state.deserialize(await fakeLoad());
        } else {
          await ig.account.login(
            process.env.NEXT_PUBLIC_IG_USERNAME as string,
            process.env.NEXT_PUBLIC_IG_PASSWORD as string
          );
          const serialized = await ig.state.serialize();
          delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
          await fakeSave(serialized);
        }

        const { url } = (await ig.user.info(await ig.user.getIdByUsername(username))).hd_profile_pic_url_info;
        return res.status(200).json({ url });
      }

      return res.status(400).json({
        status: 'Failed',
        message: 'Recaptcha failed',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

      /**
        * login_required error
        * "Please wait a few minutes before you try again." error
      */
      if (error instanceof IgLoginRequiredError || errorMessage.includes('few minutes before')) {
        await fakeDelete();

        return res.status(400).json({
          status: 'Failed',
          message: errorMessage,
        });
      }

      const errorResponse: ErrorResponse = { status: 'Failed', message: errorMessage };
      return res.status(400).json(errorResponse);
    }
  });
}

export default Index;
