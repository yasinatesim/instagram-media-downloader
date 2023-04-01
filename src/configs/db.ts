import admin from "firebase-admin";

// @ts-ignore
const firebasePrivateKey = process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

let initialized = false;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      privateKey: firebasePrivateKey,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    }),
  });
  initialized = true;
}

const db = admin.firestore();

if (initialized) {
  db.settings({ ignoreUndefinedProperties: true });
}

export default db;
