import axios from 'axios';
import * as cheerio from 'cheerio';

import { loginToInstagram } from './login-instagram';

import cookieString from '@/utils/cookieString';
import generateDynamicHeaders from '@/utils/generateDynamicHeaders';

async function fetchData(url: string) {
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
    throw new Error(`Request to ${url} failed with status: ${response.status}`);
  }

  return response.data;
}

async function getUserIdFromInstagramSearch(username: string) {
  const url = `https://i.instagram.com/api/v1/users/search/?q=${username.toLocaleUpperCase()}&count=30&timezone_offset=${String(new Date().getTimezoneOffset() * -60)}`;
  const result = await fetchData(url);

  const users = result.users;
  const account = users.find((user: { username: string }) => user.username === username);
  if (!account) {
    throw new Error('Instagram Account not found in Instagram Search API response');
  }
  return String(account.pk);
}

async function getUserIdFromTopSearch(username: string) {
  const url = `https://www.instagram.com/web/search/topsearch/?context=blended&query=${username}&rank_token=0.3953592318270893&count=1`;
  const result = await fetchData(url);

  const users = result.users;
  const account = users.find((item: { user: { username: string } }) => item.user.username === username);
  if (!account) {
    throw new Error('Instagram Account not found in TopSearch API response');
  }
  return String(account.pk);
}

async function getUserIdFromWebProfile(username: string) {
  const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
  const result = await fetchData(url);

  if (result && result.data && result.data.user) {
    return result.data.user.id;
  }

  throw new Error('User not found in WebProfile API response');
}

async function getUserIdFromProfilePage(username: string) {
  const url = `https://www.instagram.com/${username}/`;

  try {
    const response = await axios(url);
    const $ = cheerio.load(response.data);

    const script = $('script')
      // @ts-ignore
      .filter((i, el) => $(el).html().includes('profilePage_'))
      .html();
    // @ts-ignore
    const user_id_start = script.indexOf('"profilePage_') + '"profilePage_'.length;
    // @ts-ignore
    const user_id_end = script.indexOf('"', user_id_start);
    // @ts-ignore
    const user_id = script.substring(user_id_start, user_id_end);

    return user_id;
  } catch (error) {
    throw new Error('User not found in Profile Page response');
  }
}

async function getUserIdFromInstagramGraphQL(username: string) {
  try {
    const response = await axios.post(
      'https://www.instagram.com/graphql/query/',
      `__d=www&__user=0&__a=1&__req=1o&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=PolarisUserFeedQuery&variables=%7B%22data%22%3A%7B%22count%22%3A12%2C%22include_relationship_info%22%3Atrue%2C%22latest_besties_reel_media%22%3Atrue%2C%22latest_reel_media%22%3Atrue%7D%2C%22username%22%3A%22${username}%22%2C%22__relay_internal__pv__PolarisIsLoggedInrelayprovider%22%3Atrue%2C%22__relay_internal__pv__PolarisFeedShareMenurelayprovider%22%3Atrue%7D&doc_id=8759034877476257`,
      {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9,tr;q=0.8,es;q=0.7',
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded',
          dpr: '1',
          pragma: 'no-cache',
          priority: 'u=1, i',
          'sec-ch-prefers-color-scheme': 'dark',
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-full-version-list':
            '"Not A(Brand";v="99.0.0.0", "Google Chrome";v="121.0.6167.184", "Chromium";v="121.0.6167.184"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-model': '""',
          'sec-ch-ua-platform': '"macOS"',
          'sec-ch-ua-platform-version': '"13.4.1"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'viewport-width': '1920',
          'x-asbd-id': '918374',
          'x-bloks-version-id': 'c6c7b90c445758d2f27d257e0b850f3b5e7b27dfbb81b6a470d6a40cb040a25a',
          'x-csrftoken': 'yNmAkP3tQl4eV7sHcDoRfW9gZsX1A2bE',
          'x-fb-friendly-name': 'PolarisUserFeedQuery',
          'x-fb-lsd': 'pLxQbR4a9HgWu1sVyFnCdM3eLxP9sV7j',
          'x-ig-app-id': '672145893218637',
        },
      }
    );

    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }

    const userId =
      response?.data?.data?.xdt_api__v1__feed__user_timeline_graphql_connection?.edges?.[0]?.node?.user?.id;

    if (!userId) {
      throw new Error('User ID not found in response');
    }

    return userId;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    throw new Error('Failed to fetch Instagram user ID');
  }
}

async function getUserId(username: string) {
  try {
    return await getUserIdFromProfilePage(username);
  } catch (profilePageError) {
    console.log('profilePage request failed. Trying alternative methods...', profilePageError);

    try {
      return await getUserIdFromInstagramGraphQL(username);
    } catch (getUserIdFromInstagramGraphQL) {
      console.log(
        'getUserIdFromInstagramGraphQL API request failed. Trying alternative methods...',
        getUserIdFromInstagramGraphQL
      );
      try {
        return await getUserIdFromWebProfile(username);
      } catch (webProfileError) {
        console.log('WebProfile API request failed. Trying alternative methods...', webProfileError);
        try {
          return await getUserIdFromTopSearch(username);
        } catch (topSearchError) {
          console.log('TopSearch API request failed. Trying alternative methods...', topSearchError);
          try {
            return await getUserIdFromInstagramSearch(username);
          } catch (instagramSearchError) {
            console.log(
              'Instagram Search API request failed. Trying the last alternative method...',
              instagramSearchError
            );
            try {
              const ig = await loginToInstagram();
              const userId = await ig.user.getIdByUsername(username);
              return String(userId);
            } catch (lastError) {
              const errorMessage =
                lastError instanceof Error ? lastError.message : 'Error retrieving Instagram user ID';
              throw new Error(errorMessage);
            }
          }
        }
      }
    }
  }
}

export default getUserId;
