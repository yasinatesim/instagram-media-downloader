import { NextRequest } from 'next/server';
import axios from 'axios';

import { REQUEST_HEADER } from '@/constants/requests';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'default-no-store';

const verifyRecaptcha = async (token: string) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await axios.post(
      verificationUrl,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.success) {
      throw new Error(`Recaptcha verification failed with status: ${response.status}`);
    }

    return response.data;
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
        ...REQUEST_HEADER,
      };

      try {
        const response = await axios.get(url, { headers });

        if (!response.data) {
          throw new Error(`Instagram API request failed with status: ${response.status}`);
        }

        const result = response.data;

        if (result && result.data && result.data.user) {
          const data = {
            userId: result.data.user.id,
          };

          return new Response(JSON.stringify(data), { status: 200 });
        } else {
          return new Response(JSON.stringify({ error: 'User not found' }), { status: 400 });
        }
      } catch (error) {
        console.error('Instagram API request error:', (error as Error).message);
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
      }
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
  }
}
