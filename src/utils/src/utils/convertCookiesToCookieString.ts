import { Cookies } from '@/types/cookies';

function convertCookiesToCookieString(cookiesJson: Cookies) {
  const cookiesArray = cookiesJson.cookies.map((cookie) => `${cookie.key}=${cookie.value}`);
  const cookieString = cookiesArray.join('; ');
  return cookieString;
}

export default convertCookiesToCookieString;
