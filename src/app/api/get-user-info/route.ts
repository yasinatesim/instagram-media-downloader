import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'default-no-store';

const verifyRecaptcha = async (token: string) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Recaptcha verification failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Recaptcha verification error:', (error as Error).message);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  try {
    const { username, token } = await request.json();

    if (typeof username !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid username format' }), { status: 400 });
    }

    const recaptchaResponse = await verifyRecaptcha(token);
    console.log('recaptchaResponse:', recaptchaResponse);

    if (recaptchaResponse.success && recaptchaResponse.score >= 0.5) {
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

      console.log('response:', response);
      // if (!response.ok) {
      return new Response(JSON.stringify({ error: response }), { status: 400 });
      // }

      const result = await response.json();
      console.log('result:', result);

      if (result && result.data && result.data.user) {
        const data = {
          userId: result.data.user.id,
        };

        console.log('data:', data);
        return new Response(JSON.stringify(data), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 400 });
      }
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
  }
}
