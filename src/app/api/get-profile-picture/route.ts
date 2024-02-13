import { NextRequest } from 'next/server';

import userSearch from '@/services/get-user-id';
import { getUserInfo } from '@/services/get-user-info';
import { loginFailedError } from '@/services/login-instagram';
import verifyRecaptcha, { RECAPTCHA_THRESHOLD } from '@/services/verify-recaptcha';

export async function POST(request: NextRequest) {
  const { username, token } = await request.json();

  if (typeof username !== 'string') {
    throw new Error('Invalid username format');
  }

  const recaptchaResponse = await verifyRecaptcha(token);

  if (recaptchaResponse.success && recaptchaResponse.score >= RECAPTCHA_THRESHOLD) {
    try {
      const data = await getUserInfo(username);

      if (data?.hd_profile_pic_url_info?.url) {
        return new Response(
          JSON.stringify({
            url: data.hd_profile_pic_url_info.url,
          }),
          { status: 200 }
        );
      } else {
        await loginFailedError({ name: 'login_required', message: 'login_required' });
        throw new Error('Session expired, please try again');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      const errorResponse = { status: 'Failed', message: errorMessage };

      await loginFailedError(error as Error);

      return new Response(JSON.stringify({ error: errorResponse }), { status: 400 });
    }
  }
}
