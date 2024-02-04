import axios from 'axios';

import { loginToInstagram } from './login-instagram';

import cookieString from '@/utils/cookieString';
import generateDynamicHeaders from '@/utils/generateDynamicHeaders';

async function getUserId(username: string) {
  try {
    const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
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

    const result = response.data;

    if (result && result.data && result.data.user) {
      return result.data.user.id;
    }
  } catch (error) {
    console.error('Instagram API request failed. Falling back to alternative method');

    try {
      const url = `https://www.instagram.com/web/search/topsearch/?context=blended&query=${username}&rank_token=0.3953592318270893&count=1`;
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

      const result = response.data;

      const users = result.users;
      const account = users.find((item: { user: { username: string } }) => item.user.username === username);
      if (!account) {
        throw new Error('Instagram Account not found');
      }
      return String(account.pk);
    } catch (error) {
      console.error('Instagram API request failed. Falling back to alternative method');
      try {
        const ig = await loginToInstagram();
        const userId = await ig.user.getIdByUsername(username);
        return userId;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error retrieving Instagram user ID';
        throw new Error(errorMessage);
      }
    }
  }

  try {
    const url = `https://i.instagram.com/api/v1/users/search/?q=${username.toLocaleUpperCase()}&count=30&timezone_offset=${String(new Date().getTimezoneOffset() * -60)}`;
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

    const result = response.data;

    const users = result.users;
    const account = users.find((user: { username: string }) => user.username === username);
    if (!account) {
      throw new Error('Instagram Account not found');
    }
    return String(account.pk);
  } catch (error) {
    console.error('Instagram API request failed. Falling back to alternative method');
    try {
      const ig = await loginToInstagram();
      const userId = await ig.user.getIdByUsername(username);
      return String(userId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error retrieving Instagram user ID';
      throw new Error(errorMessage);
    }
  }
}

export default getUserId;
