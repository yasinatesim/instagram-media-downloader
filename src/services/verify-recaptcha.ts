import axios from 'axios';

export const RECAPTCHA_THRESHOLD = 0.5;

async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await axios.post(verificationUrl, {}, { headers: { 'Content-Type': 'application/json' } });

    if (!response.data.success || response.data.score < RECAPTCHA_THRESHOLD) {
      throw new Error('Recaptcha verification failed');
    }

    return response.data;
  } catch (error) {
    console.error('Recaptcha verification error:', (error as Error).message);
    throw error;
  }
}

export default verifyRecaptcha;
