import { NextRequest } from 'next/server';

import axios from 'axios';

import { loadSessionData } from '@/services/login-instagram';
import verifyRecaptcha, { RECAPTCHA_THRESHOLD } from '@/services/verify-recaptcha';

import convertCookiesToCookieString from '@/utils/src/utils/convertCookiesToCookieString';

// Todo: Implement this
// https://www.instagram.com/graphql/query/?query_id=17888483320059182&id={user_id}&first=24

// Todo: Implement this
// https://www.instagram.com/web/search/topsearch/?context=blended&query={username}&rank_token=0.3953592318270893&count=1
// the api use sessionid cookie

export async function POST(request: NextRequest) {
  try {
    const { username, token } = await request.json();

    if (typeof username !== 'string') {
      throw new Error('Invalid username format');
    }

    const recaptchaResponse = await verifyRecaptcha(token);

    const savedCookie = await loadSessionData();

    const cookieString = convertCookiesToCookieString(JSON.parse(savedCookie?.cookies));

    if (recaptchaResponse.success && recaptchaResponse.score >= RECAPTCHA_THRESHOLD) {
      try {
        const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
        const headers = {
          Accept: 'application/json, text/plain, */*',
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 9; GM1903 Build/PKQ1.190110.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36 Instagram 103.1.0.15.119 Android (28/9; 420dpi; 1080x2260; OnePlus; GM1903; OnePlus7; qcom; sv_SE; 164094539)',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-asbd-id': '46548741',
          'X-IG-App-ID': '936619743392459',
          cookie: cookieString,
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

      // const ig = await loginToInstagram();

      // const userId = await getInstagramUserId(ig, username);

      // return new Response(
      //   JSON.stringify({
      //     userId,
      //   }),
      //   { status: 200 }
      // );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    const errorResponse = { status: 'Failed', message: errorMessage };

    return new Response(JSON.stringify({ error: errorResponse }), { status: 400 });
  }
}
