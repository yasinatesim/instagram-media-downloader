import { NextRequest } from 'next/server';

import { IgApiClient, IgLoginRequiredError } from 'instagram-private-api';

import { deleteSessionData, initializeInstagramApi, loginToInstagram } from '@/services/login-instagram';
import verifyRecaptcha, { RECAPTCHA_THRESHOLD } from '@/services/verify-recaptcha';

import { getInstagramUserId } from '../get-user-id/route';

export async function POST(request: NextRequest) {
  try {
    const { username, token } = await request.json();

    if (typeof username !== 'string') {
      throw new Error('Invalid username format');
    }

    const recaptchaResponse = await verifyRecaptcha(token);

    if (recaptchaResponse.success && recaptchaResponse.score >= RECAPTCHA_THRESHOLD) {
      const ig = await initializeInstagramApi();
      await loginToInstagram(ig);

      const userId = await getInstagramUserId(ig, username);

      const { url } = (await ig.user.info(userId)).hd_profile_pic_url_info;

      return new Response(
        JSON.stringify({
          url,
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    /**
     * login_required error
     * "Please wait a few minutes before you try again." error
     */
    if (error instanceof IgLoginRequiredError || errorMessage.includes('few minutes before')) {
      await deleteSessionData();
      return new Response(JSON.stringify({ error: errorMessage }), { status: 400 });
    }

    const errorResponse = { status: 'Failed', message: errorMessage };

    return new Response(JSON.stringify({ error: errorResponse }), { status: 400 });
  }
}
