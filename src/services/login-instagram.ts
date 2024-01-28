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

async function loadSessionData() {
  try {
    const doc = await db.collection('data').doc('session').get();
    return doc.exists ? doc.data() : {};
  } catch (error) {
    console.log('Error loading session data:', (error as Error).message);
    return {};
  }
}

export async function deleteSessionData() {
  try {
    await db.collection('data').doc('session').delete();
  } catch (error) {
    console.log('Error deleting session data:', (error as Error).message);
  }
}

export async function initializeInstagramApi() {
  const ig = new IgApiClient();

  ig.state.deviceString = process.env.IG_DEVICE_STRING as string;
  ig.state.deviceId = process.env.IG_DEVICE_ID as string;
  ig.state.uuid = process.env.IG_UUID as string;
  ig.state.phoneId = process.env.IG_PHONE_ID as string;
  ig.state.adid = process.env.IG_ADID as string;
  ig.state.build = process.env.IG_BUILD as string;

  return ig;
}

export async function loginToInstagram(ig: IgApiClient) {
  try {
    if (await sessionDataExists()) {
      await ig.state.deserialize(await loadSessionData());
    } else {
      await ig.account.login(process.env.IG_USERNAME as string, process.env.IG_PASSWORD as string);
      const serialized = await ig.state.serialize();
      delete serialized.constants;
      await saveSessionData(serialized);
    }
  } catch (error) {
    throw new Error('Instagram login failed');
  }
}
