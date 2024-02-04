import { loadSessionData } from '@/services/login-instagram';

export async function cookieString() {
  const savedCookie = await loadSessionData();

  const cookieDb = JSON.parse(savedCookie?.cookies);

  const cookiesArray = cookieDb.cookies.map(
    (cookie: { key: string; value: string }) => `${cookie.key}=${cookie.value}`
  );
  const cookieString = cookiesArray.join('; ');
  return cookieString;
}

export default cookieString;
