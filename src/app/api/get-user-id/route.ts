import { NextRequest } from 'next/server';

import getUserId from '@/services/get-user-id';
import { loginFailedError } from '@/services/login-instagram';
import verifyRecaptcha, { RECAPTCHA_THRESHOLD } from '@/services/verify-recaptcha';

import { sleep } from '@/utils/sleep';

// Todo: Implement this -- new service -- for user posts
// https://www.instagram.com/graphql/query/?query_id=17888483320059182&id={user_id}&first=24
// or
//https://www.instagram.com/graphql/query/?query_hash=e769aa130647d2354c40ea6a439bfc08&variables={"id":{user_id},"first": 24}

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
        const userId = await getUserId(username);

        return new Response(
          JSON.stringify({
            userId,
          }),
          { status: 200 }
        );
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
