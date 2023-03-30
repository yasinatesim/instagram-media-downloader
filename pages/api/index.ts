import { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
import fs from 'fs';
import { IgApiClient } from 'instagram-private-api';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'session.json');

type ErrorResponse = {
  status: string;
  message: string;
};

const verifyRecaptcha = async (token: string) => {
  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  return axios.post(verificationUrl);
};

function fakeSave(data: object) {
  // here you would save it to a file/database etc.
  // you could save it to a file: writeFile(path, JSON.stringify(data))

  return fs.chmod(filePath, '777', (err) => {
    if (err) {
      console.log(err);
    }
    const jsonData = JSON.stringify(data);
    fs.writeFileSync(filePath, jsonData);
  });
}

function fakeExists(): any {
  // here you would check if the data exists
  return fs.existsSync(filePath);
}

function fakeLoad() {
  // here you would load the data
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function Index(req: NextApiRequest, res: NextApiResponse<ErrorResponse | { url: string }>) {
  const { token, username } = req.body;

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

      if (fakeExists()) {
        await ig.state.deserialize(fakeLoad());
      } else {
        await ig.account.login(
          process.env.NEXT_PUBLIC_IG_USERNAME as string,
          process.env.NEXT_PUBLIC_IG_PASSWORD as string
        );
        const serialized = await ig.state.serialize();
        delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
        fakeSave(serialized);
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
    const errorResponse: ErrorResponse = { status: 'Failed', message: errorMessage };
    return res.status(400).json(errorResponse);
  }
}

export default Index;
