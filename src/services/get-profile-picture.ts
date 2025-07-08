import axios from 'axios';

import { getUserInfo } from '@/services/get-user-info';

import getUserId from './get-user-id';

async function getProfilePictureFromInstagrmApi(username: string) {
  const userId = await getUserId(username);

  try {
    const response = await axios.post(
      'https://www.instagram.com/graphql/query',
      `__d=www&__user=0&__a=1&__req=1o&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=PolarisUserHoverCardContentV2Query&variables=%7B%22userID%22%3A%22${userId}%22%2C%22username%22%3A%22${username}%22%7D&server_timestamps=true&doc_id=7953815318003879`,
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
          'x-fb-friendly-name': 'PolarisUserHoverCardContentV2DirectQuery',
          'x-fb-lsd': 'pLxQbR4a9HgWu1sVyFnCdM3eLxP9sV7j',
          'x-ig-app-id': '672145893218637',
        },
      }
    );

    const pic = response?.data?.data?.user?.hd_profile_pic_url_info?.url;

    if (pic) {
      return pic;
    }

    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.log('error:', error);
    throw new Error('User not found in Instagram Api response');
  }
}

async function getProfilePicture(username: string) {
  try {
    return await getProfilePictureFromInstagrmApi(username);
  } catch (instagramApiError) {
    console.log('Instagram API request failed. Trying the last alternative method...', instagramApiError);
    try {
      const data = await getUserInfo(username);
      if (data?.hd_profile_pic_url_info?.url) {
        return data.hd_profile_pic_url_info.url;
      } else {
        throw new Error('User not found in user info response');
      }
    } catch (lastError) {
      // Yeni fallback: kullanıcıya manuel json yapıştırmasını iste
      const userId = await getUserId(username);
      const generatedUrl = `https://www.instagram.com/graphql/query/?doc_id=9539110062771438&variables={\"id\":\"${userId}\",\"render_surface\":\"PROFILE\"}`;
      const manualInputMessage = {
        message:
          'Otomatik olarak profil fotoğrafı alınamadı. Lütfen aşağıdaki URL ile Instagram’dan JSON verisini kopyalayıp, çıkan JSON’u aşağıya yapıştırın.',
        url: generatedUrl,
        instructions: 'Açılan sayfada çıkan JSON verisini kopyalayıp, aşağıdaki inputa yapıştırın.',
        example: '{"data":{"user":{"hd_profile_pic_url_info":{"url":"<HD_PROFILE_PIC_URL>"}}}}',
      };
      // Bu mesajı frontend'e iletmek için bir Error objesi olarak fırlatıyoruz
      throw new Error(JSON.stringify(manualInputMessage));
    }
  }
}

export default getProfilePicture;
