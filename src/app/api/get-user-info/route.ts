import { NextRequest } from 'next/server';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    const headers = {
      'User-Agent': 'iphone_ua',
      'x-ig-app-id': '936619743392459',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
    };

    const response = await fetch(url, {
      headers,
    });

    const result = await response.json();

    if (result && result.data && result.data.user) {
      const data = {
        userId: result.data.user.id,
      };

      return Response.json(data, { status: 200 });
    }
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}
