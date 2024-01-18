import { NextRequest } from 'next/server';

import axios from 'axios';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 9; GM1903 Build/PKQ1.190110.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36 Instagram 103.1.0.15.119 Android (28/9; 420dpi; 1080x2260; OnePlus; GM1903; OnePlus7; qcom; sv_SE; 164094539)',
      'X-IG-App-ID': 'magic value',
    };

    // @ts-ignore
    const headersString = Object.keys(headers).map(key => `${key}: ${headers[key]}`).join(' -H ');

    const curlCommand = `curl -X GET "${url}" -H "${headersString}"`;
    const result = execSync(curlCommand, { encoding: 'utf-8' });

    const parsedResult = JSON.parse(result);

    const data = {
      userId: parsedResult.data.user.id,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    // @ts-ignore
    return Response.json(error.response.data, { status: 400 });
  }
}
