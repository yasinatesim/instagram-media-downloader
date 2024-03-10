import axios from 'axios';

import getUserId from './get-user-id';
import { loginToInstagram } from './login-instagram';

import cookieString from '@/utils/cookieString';
import generateDynamicHeaders from '@/utils/generateDynamicHeaders';

// https://i.instagram.com/api/v1/users/${id}/info/
export async function getUserInfo(username: string) {
  const userId = await getUserId(username);
  try {
    const response = await axios.request({
      method: 'GET',
      url: `https://instagram-api-20231.p.rapidapi.com/api/get_user_info/${userId}`,
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'instagram-api-20231.p.rapidapi.com',
      },
    });

    if (response.status !== 200) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    return response.data.data;
  } catch (rapidApiError) {
    console.error('Instagram API request failed. Falling back to alternative method', rapidApiError);

    try {
      const url = `https://i.instagram.com/api/v1/users/${userId}/info/`;
      const headers = {
        Accept: 'application/json, text/plain, */*',
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 9; GM1903 Build/PKQ1.190110.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36 Instagram 103.1.0.15.119 Android (28/9; 420dpi; 1080x2260; OnePlus; GM1903; OnePlus7; qcom; sv_SE; 164094539)',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        ...generateDynamicHeaders(),
        cookie: await cookieString(),
      };

      const response = await axios.get(url, { headers, maxBodyLength: Infinity, maxRedirects: 0 });

      if (response.status !== 200) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      return response.data.user;
    } catch (error) {
      console.error('Instagram API request failed. Falling back to alternative method');
      try {
        const ig = await loginToInstagram();
        return await ig.user.info(userId);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error retrieving Instagram user ID';
        throw new Error(errorMessage);
      }
    }
  }
}
