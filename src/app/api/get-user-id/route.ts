import { NextRequest } from 'next/server';

import axios from 'axios';
import { IgLoginRequiredError } from 'instagram-private-api';

import { getInstagramUserId } from '@/services/instagram';
import { deleteSessionData, initializeInstagramApi, loginToInstagram } from '@/services/login-instagram';
import verifyRecaptcha, { RECAPTCHA_THRESHOLD } from '@/services/verify-recaptcha';

import generateDynamicHeaders from '@/utils/src/utils/generateDynamicHeaders';

export async function POST(request: NextRequest) {
  try {
    const { username, token } = await request.json();

    if (typeof username !== 'string') {
      throw new Error('Invalid username format');
    }

    const recaptchaResponse = await verifyRecaptcha(token);

    if (recaptchaResponse.success && recaptchaResponse.score >= RECAPTCHA_THRESHOLD) {
      try {
        const dynamicHeaders = generateDynamicHeaders();
        const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
        const headers = {
          Accept: 'application/json, text/plain, */*',
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 9; GM1903 Build/PKQ1.190110.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36 Instagram 103.1.0.15.119 Android (28/9; 420dpi; 1080x2260; OnePlus; GM1903; OnePlus7; qcom; sv_SE; 164094539)',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          ...dynamicHeaders,
        };

        const response = await axios.get(url, { headers, maxBodyLength: Infinity, maxRedirects: 0 });

        if (response.status !== 200) {
          throw new Error(`Request failed with status: ${response.status}`);
        }

        const result = response.data;

        if (result && result.data && result.data.user) {
          return new Response(
            JSON.stringify({
              userId: result.data.user.id,
            }),
            { status: 200 }
          );
        }
      } catch (error) {
        console.error('Instagram API request failed. Falling back to alternative method.', error);
      }

      const ig = await initializeInstagramApi();
      await loginToInstagram(ig);

      const userId = await getInstagramUserId(ig, username);

      return new Response(
        JSON.stringify({
          userId,
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
