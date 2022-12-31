// @ts-nocheck
import { Helmet } from 'react-helmet';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

// Styles
import '@/assets/styles/app.scss';
import { useState } from 'react';
import encrypt from '@/helpers/encrypt';

function Layout({ Component, pageProps }) {
  const [value, setValue] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;


  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  const handleFormSubmit = () => {
    if (encrypt(value) === password) {
      setIsLoggedIn(true);
    }
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleFormSubmit();
    }
  };

  if (!isLoggedIn) {

  console.log(encrypt('beyza'));
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
          <label htmlFor="password" title="Şifrenizi girin" data-title="Şifre" />
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
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          title="Hello next.js!"
          meta={[
            {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1',
            },
            { property: 'og:title', content: 'Hello next.js!' },
          ]}
        />
        <Component {...pageProps} />
      </GoogleReCaptchaProvider>
    </>
  );
}

export default Layout;
