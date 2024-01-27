import { NextRequest } from 'next/server';

import axios from 'axios';

import { REQUEST_HEADER } from '@/constants/requests';

import generateDynamicHeaders from '@/utils/generateDynamicHeaders';

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

    if (!response.data.success || response.data.score < 0.5) {
      throw new Error('Recaptcha verification failed');
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

    const dynamicHeaders = generateDynamicHeaders();

    if (recaptchaResponse.success && recaptchaResponse.score >= 0.5) {
      const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
      const headers = {
        ...REQUEST_HEADER,
        ...dynamicHeaders,
      };

      try {
        const response = await axios.get(url, { headers, maxRedirects: 0 });

        if (response.status !== 200) {
          throw new Error(`Request failed with status: ${response.status}`);
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
        console.error('Request error:', (error as Error).message);
        throw error;
      }
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
  }
}
