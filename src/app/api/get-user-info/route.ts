import { NextRequest } from 'next/server';

import fetch from 'node-fetch'

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 9; GM1903 Build/PKQ1.190110.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36 Instagram 103.1.0.15.119 Android (28/9; 420dpi; 1080x2260; OnePlus; GM1903; OnePlus7; qcom; sv_SE; 164094539)',
      'x-asbd-id': "198387",
      'x-csrftoken': 'gqeYY9dr1dCwfvtyZCgy88tcMn1A2N85',
      'x-requested-with': 'XMLHttpRequest',
      'X-IG-App-ID': "936619743392459",
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
    };

    const response = await fetch(url, {
      headers,
    });
    const result = await response.json();
    console.log('result:', result);

    const data = {
      // @ts-ignore
      userId: result.data.user.id,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}
