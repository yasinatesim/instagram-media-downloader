import { NextRequest } from 'next/server';

import getProfilePicture from '@/services/get-profile-picture';
import { loginFailedError } from '@/services/login-instagram';
import verifyRecaptcha, { RECAPTCHA_THRESHOLD } from '@/services/verify-recaptcha';

import { sleep } from '@/utils/sleep';

export async function POST(request: NextRequest) {
  const { username, token } = await request.json();

  if (typeof username !== 'string') {
    throw new Error('Invalid username format');
  }

  try {
    const recaptchaResponse = await verifyRecaptcha(token);

    if (recaptchaResponse.success && recaptchaResponse.score >= RECAPTCHA_THRESHOLD) {
      await sleep();

      try {
        const url = await getProfilePicture(username);

        if (url) {
          return new Response(
            JSON.stringify({
              url,
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
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
  }
}
