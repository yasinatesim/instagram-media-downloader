import { IgApiClient } from 'instagram-private-api';

import db from '@/configs/db';

async function saveSessionData(data: object) {
  try {
    const options = { ignoreUndefinedProperties: true } as any;
    await db.collection('data').doc('session').set(data, options);
  } catch (error) {
    console.log('Error saving session data:', (error as Error).message);
  }
}

async function sessionDataExists() {
  try {
    const doc = await db.collection('data').doc('session').get();
    return doc.exists;
  } catch (error) {
    console.log('Error checking session data existence:', (error as Error).message);
    return false;
  }
}

export async function loadSessionData() {
  try {
    const doc = await db.collection('data').doc('session').get();
    return doc.exists ? doc.data() : '';
  } catch (error) {
    console.log('Error loading session data:', (error as Error).message);
    return '';
  }
}

async function deleteSessionData() {
  try {
    await db.collection('data').doc('session').delete();
  } catch (error) {
    console.log('Error deleting session data:', (error as Error).message);
  }
}

export async function loginFailedError(error: Error) {
  if (error.message.includes('login_required') || error.message.includes('few minutes before')) {
    await deleteSessionData();
  }
}

export async function loginToInstagram() {
  const ig = new IgApiClient();

  try {
    if (await sessionDataExists()) {
      const savedCookie = await loadSessionData();

      await ig.state.deserialize(savedCookie);

      if (savedCookie) {
        ig.state.deviceString = savedCookie.deviceString;
        ig.state.deviceId = savedCookie.deviceId;
        ig.state.uuid = savedCookie.uuid;
        ig.state.phoneId = savedCookie.phoneId;
        ig.state.adid = savedCookie.adid;
        ig.state.build = savedCookie.build;
      }
    } else {
      ig.state.deviceString = process.env.IG_DEVICE_STRING as string;
      ig.state.deviceId = process.env.IG_DEVICE_ID as string;
      ig.state.uuid = process.env.IG_UUID as string;
      ig.state.phoneId = process.env.IG_PHONE_ID as string;
      ig.state.adid = process.env.IG_ADID as string;
      ig.state.build = process.env.IG_BUILD as string;

      await ig.account.login(process.env.IG_USERNAME as string, process.env.IG_PASSWORD as string);
      const serialized = await ig.state.serialize();
      delete serialized.constants;
      await saveSessionData(serialized);
    }

    return ig;
  } catch (error) {
    await loginFailedError(error as Error);
    throw new Error('Instagram login failed');
  }
}
