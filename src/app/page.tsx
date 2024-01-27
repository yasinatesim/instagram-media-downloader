'use client';
import GoogleCaptchaWrapper from './google-captcha-wrapper';

import HomePage from '@/pages/Home';

const Home = () => {
  return (
    <GoogleCaptchaWrapper>
      <HomePage />
    </GoogleCaptchaWrapper>
  );
};

export default Home;
