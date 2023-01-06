import React, { useState } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { AppProps } from 'next/app';

import encrypt from '@/helpers/encrypt';

// Styles
import '@/assets/styles/app.scss';

function Layout({ Component, pageProps }: AppProps) {
  const [value, setValue] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleFormSubmit = () => {
    if (encrypt(value) === password) {
      setIsLoggedIn(true);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleFormSubmit();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="field">
          <input
            type="password"
            required
            autoComplete="off"
            id="password"
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
          />
          <label htmlFor="password" title="Your Admin Password" data-title="Password" />
          <button type="button" onClick={handleFormSubmit} className="form-btn">
            Gönder
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
        scriptProps={{
          async: false,
          defer: true,
          appendTo: 'body',
          nonce: undefined,
        }}
      >
        <Component {...pageProps} />
      </GoogleReCaptchaProvider>
    </>
  );
}

export default Layout;
