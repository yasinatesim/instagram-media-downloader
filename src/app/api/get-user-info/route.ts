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

    if (recaptchaResponse.success && recaptchaResponse.score >= 0.5) {
      const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 9; GM1903 Build/PKQ1.190110.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36 Instagram 103.1.0.15.119 Android (28/9; 420dpi; 1080x2260; OnePlus; GM1903; OnePlus7; qcom; sv_SE; 164094539)',
        'X-IG-App-ID': '936619743392459',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      };

      const response = await fetch(url, {
        headers,
      });

      //      return new Response(JSON.stringify({ error: await response.text() }), { status: 200 });
      if (!response.ok) {
        return new Response(JSON.stringify({ error: response }), { status: 400 });
      }

      const result = await response.json();

      if (result && result.data && result.data.user) {
        const data = {
          userId: result.data.user.id,
        };

        return new Response(JSON.stringify(data), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 400 });
      }
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
  }
}
