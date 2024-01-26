import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
// export const runtime = 'edge';
// export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    const headers = {
      'User-Agent':
        'Instagram 219.0.0.12.117 Android',
      'X-IG-App-ID': `${new Date().getTime()}`,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
    };

    const response = await fetch(url, {
      headers,
    });

    if (!response.ok) {
      return Response.json({
        error: 'error 1'
      }, { status: 400 });
    }

    const result = await response.json();
    // console.log("result:", result)

    if (result && result.data && result.data.user) {
      const data = {
        userId: result.data.user.id,
      };

      return Response.json(data, { status: 200 });
    } else {
      return Response.json({
        error: 'error'
      }, { status: 400 });
    }
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}
