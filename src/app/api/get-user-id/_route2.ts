import { NextRequest } from 'next/server';

import axios from 'axios';
import * as cheerio from 'cheerio';

import verifyRecaptcha, { RECAPTCHA_THRESHOLD } from '@/services/verify-recaptcha';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { username, token } = await request.json();

  if (typeof username !== 'string') {
    throw new Error('Invalid username format');
  }

  const recaptchaResponse = await verifyRecaptcha(token);

  if (recaptchaResponse.success && recaptchaResponse.score >= RECAPTCHA_THRESHOLD) {
    try {
      const response = await axios.get(`https://www.instagram.com/${username}`);
      const html = response.data;

      const $ = cheerio.load(html);

      const scriptTagContent = $('script')
        // @ts-ignore
        .filter((i, el) => {
          const scriptContent = $(el).html();
          return scriptContent && scriptContent.includes('profilePage');
        })
        .html();

      const jsonMatch = /{"page_id":"profilePage_(\d+)","profile_id":"(\d+)"/.exec(scriptTagContent as any);

      if (jsonMatch) {
        return new Response(
          JSON.stringify({
            userId: jsonMatch[1],
          }),
          { status: 200 }
        );
      } else {
        const errorResponse = { status: 'Failed', message: 'User not found' };

        return new Response(JSON.stringify({ error: errorResponse }), { status: 400 });
      }
    } catch (error) {
      console.error('Instagram API request failed. Falling back to alternative method.', error);
    }
  }
}
