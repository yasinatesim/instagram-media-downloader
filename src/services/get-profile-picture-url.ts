import axios from 'axios';
import * as cheerio from 'cheerio';

export async function getProfilePictureUrlFromSaveIg(username: string) {
  try {
    const response = await axios.post(
      'https://v3.saveig.app/api/ajaxSearch',
      `q=https://www.instagram.com/${username}/&t=media&lang=en`,
      {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 9; GM1903 Build/PKQ1.190110.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36 Instagram 103.1.0.15.119 Android (28/9; 420dpi; 1080x2260; OnePlus; GM1903; OnePlus7; qcom; sv_SE; 164094539)',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
        },
      }
    );

    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }

    const html = response.data.data;

    const $ = cheerio.load(html);
    const data = $('a[title="Download Avatar"]').attr('href');

    if (data) {
      return data.replace(/&?dl=1/, '');
    }
  } catch (error) {
    throw new Error('User not found in Save Ig response');
  }
}
