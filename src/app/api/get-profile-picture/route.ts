import { NextRequest } from 'next/server';

import { IgApiClient, IgLoginRequiredError } from 'instagram-private-api';

import { getInstagramUserId } from '@/services/instagram';
import { loginToInstagram } from '@/services/login-instagram';
import verifyRecaptcha, { RECAPTCHA_THRESHOLD } from '@/services/verify-recaptcha';

export async function POST(request: NextRequest) {
  try {
    const { username, token } = await request.json();

    if (typeof username !== 'string') {
      throw new Error('Invalid username format');
    }

    const recaptchaResponse = await verifyRecaptcha(token);

    if (recaptchaResponse.success && recaptchaResponse.score >= RECAPTCHA_THRESHOLD) {
      const ig = await loginToInstagram();

      ///api/v1/users/search/ q=username&count=30 timezone_offset=  String(new Date().getTimezoneOffset() * -60)
      const userId = await getInstagramUserId(ig, username);

      // /api/v1/users/${id}/info/
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
    const errorResponse = { status: 'Failed', message: errorMessage };

    return new Response(JSON.stringify({ error: errorResponse }), { status: 400 });
  }
}
